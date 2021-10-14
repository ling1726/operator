import { createMachine, sendParent, actions } from "xstate";
import { SocketContext, SocketEvent, SocketTypestate } from "./types";

export const WebSocketState = {
  connecting: 0,
  open: 1,
  closing: 2,
  closed: 3,
} as const;

export const socketMachine = createMachine<
  SocketContext,
  SocketEvent,
  SocketTypestate
>(
  {
    id: "socket",
    initial: "unknown",
    context: {},
    states: {
      unknown: {
        always: [
          { target: "unavailable", cond: "isUnavailable" },
          { target: "available", cond: "isAvailable" },
        ],
      },
      unavailable: {
        entry: actions.assign<SocketContext, SocketEvent>({
          socket: undefined,
          latestResponse: undefined,
        }),
        on: {
          CONNECT: {
            actions: actions.assign((_, { payload: { url } }) => ({
              socket: new WebSocket(url),
            })),
            target: "unknown",
          },
        },
      },
      available: {
        initial: "unknown",
        invoke: { src: "addListeners" },
        on: {
          VERIFY_STATE: ".unknown",
        },
        states: {
          unknown: {
            always: [
              { target: "connecting", cond: "isConnecting" },
              { target: "open", cond: "isOpen" },
              { target: "closing", cond: "isClosing" },
              { target: "closed", cond: "isClosed" },
            ],
          },
          connecting: {},
          open: {
            on: {
              RESPONSE: {
                actions: [
                  actions.assign((_, { payload }) => ({
                    latestResponse: payload,
                  })),
                  sendParent((_, { payload }) => payload),
                ],
              },
              REQUEST: {
                actions: ({ socket }, ev) =>
                  socket?.send(JSON.stringify(ev.payload)),
              },
            },
          },
          closing: {},
          closed: {
            always: "#socket.unavailable",
          },
        },
      },
    },
  },
  {
    guards: {
      isUnavailable: ({ socket }) => socket === undefined,
      isAvailable: ({ socket }) => socket instanceof WebSocket,
      isConnecting: ({ socket }) =>
        Boolean(socket && socket.readyState === WebSocketState.connecting),
      isOpen: ({ socket }) =>
        Boolean(socket && socket.readyState === WebSocketState.open),
      isClosing: ({ socket }) =>
        Boolean(socket && socket.readyState === WebSocketState.closing),
      isClosed: ({ socket }) =>
        Boolean(socket && socket.readyState === WebSocketState.closed),
    },
    services: {
      addListeners:
        ({ socket }) =>
        (send) => {
          if (!socket) return;
          const listener = () => send({ type: "VERIFY_STATE" });
          const messageListener = (ev: MessageEvent<string>) =>
            send({ type: "RESPONSE", payload: JSON.parse(ev.data) });

          socket.addEventListener("open", listener);
          socket.addEventListener("close", listener);
          socket.addEventListener("error", listener);
          socket.addEventListener("message", messageListener);
          return () => {
            socket.removeEventListener("open", listener);
            socket.removeEventListener("close", listener);
            socket.removeEventListener("error", listener);
            socket.removeEventListener("message", messageListener);
          };
        },
    },
  }
);
