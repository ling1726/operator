import {
  createMachine,
  Interpreter,
  ActionFunction,
  State,
  sendParent,
  SendAction,
} from "xstate";

import { Response, Request } from "../api";

export const WebSocketState = [
  "CONNECTING",
  "OPEN",
  "CLOSING",
  "CLOSED",
] as const;

export type SocketEvent =
  | {
      type: "REQUEST";
      payload: Request;
    }
  | { type: "RESPONSE"; payload: Response }
  | { type: "REQUEST_CLOSE" }
  | { type: "RESPONSE_CLOSE" }
  | { type: "RESPONSE_ERROR"; event: Event }
  | { type: "RESPONSE_OPEN" };

export interface SocketContext {
  socket: WebSocket;
}

export type SocketTypestate =
  | {
      value: "connecting";
      context: SocketContext;
    }
  | {
      value: "open";
      context: SocketContext;
    }
  | {
      value: "closing";
      context: SocketContext;
    }
  | {
      value: "closed";
      context: SocketContext;
    };

export type SocketService = Interpreter<
  SocketContext,
  any,
  SocketEvent,
  SocketTypestate
>;

export type SocketState = State<
  SocketContext,
  SocketEvent,
  any,
  SocketTypestate
>;

export const socketMachine = createMachine<
  SocketContext,
  SocketEvent,
  SocketTypestate
>(
  {
    id: "Socket",
    initial: "idle",
    invoke: [
      {
        src: "listenResponse",
      },
      {
        src: "listenError",
      },
      {
        src: "listenClose",
      },
    ],
    on: {
      RESPONSE_OPEN: "open",
      RESPONSE_CLOSE: "closed",
      RESPONSE_ERROR: "closed",
    },
    states: {
      idle: {
        always: [
          { target: "connecting", cond: "isConnecting" },
          { target: "open", cond: "isOpen" },
          { target: "closing", cond: "isClosing" },
          { target: "closed", cond: "isClosed" },
        ],
      },
      connecting: {
        on: {
          REQUEST_CLOSE: "closing",
        },
      },
      open: {
        on: {
          RESPONSE: {
            actions: "raiseResponse",
          },
          REQUEST_CLOSE: "closing",
          REQUEST: {
            actions: "request",
          },
        },
      },
      closing: {},
      closed: {
        type: "final",
      },
    },
  },
  {
    guards: {
      isConnecting: ({ socket: { readyState } }) =>
        WebSocketState[readyState] === "CONNECTING",
      isOpen: ({ socket: { readyState } }) =>
        WebSocketState[readyState] === "OPEN",
      isClosing: ({ socket: { readyState } }) =>
        WebSocketState[readyState] === "CLOSING",
      isClosed: ({ socket: { readyState } }) =>
        WebSocketState[readyState] === "CLOSED",
    },
    actions: {
      raiseResponse: sendParent(
        (_, ev: Extract<SocketEvent, { type: "RESPONSE" }>) => ev.payload
      ) as SendAction<SocketContext, SocketEvent, Response>,
      request: (({ socket }, ev: Extract<SocketEvent, { type: "REQUEST" }>) => {
        socket.send(JSON.stringify(ev.payload));
      }) as ActionFunction<SocketContext, SocketEvent>,
    },
    services: {
      listenOpen:
        ({ socket }) =>
        (send) => {
          const listener = () => send({ type: "RESPONSE_OPEN" });
          socket.addEventListener("open", listener);
          return () => socket.removeEventListener("open", listener);
        },
      listenClose:
        ({ socket }) =>
        (send) => {
          const listener = () => send({ type: "RESPONSE_CLOSE" });
          socket.addEventListener("close", listener);
          return () => socket.removeEventListener("close", listener);
        },
      listenError:
        ({ socket }) =>
        (send) => {
          const listener = (event: Event) =>
            send({ type: "RESPONSE_ERROR", event });
          socket.addEventListener("error", listener);
          return () => socket.removeEventListener("error", listener);
        },
      listenResponse:
        ({ socket }) =>
        (send) => {
          const listener = (ev: MessageEvent<string>) =>
            send({
              type: "RESPONSE",
              payload: JSON.parse(ev.data),
            });
          socket.addEventListener("message", listener);
          return () => socket.removeEventListener("message", listener);
        },
    },
  }
);

export const socketSelector = {
  isConnecting: (state: SocketState) => state.matches("connecting"),
  isOpen: (state: SocketState) => state.matches("open"),
  isClosing: (state: SocketState) => state.matches("closing"),
  isClosed: (state: SocketState) => state.matches("closed"),
};
