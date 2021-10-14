import { Interpreter, State } from "xstate";

import * as api from "../../api";

export type SocketEvent =
  | { type: "CONNECT"; payload: { url: string } }
  | { type: "REQUEST"; payload: api.Request }
  | { type: "RESPONSE"; payload: api.Response }
  | { type: "VERIFY_STATE" };

export interface SocketContext {
  socket?: WebSocket;
  latestResponse?: api.Response;
}

export type SocketTypestate =
  | {
      value: "unknown";
      context: SocketContext & { socket: undefined };
    }
  | {
      value: "unavailable";
      context: SocketContext & { socket: undefined };
    }
  | {
      value: "available.connecting";
      context: SocketContext & Required<Pick<SocketContext, "socket">>;
    }
  | {
      value: "available.open";
      context: SocketContext & { socket: WebSocket };
    }
  | {
      value: "available.closing";
      context: SocketContext & Required<Pick<SocketContext, "socket">>;
    }
  | {
      value: "available.closed";
      context: SocketContext & Required<Pick<SocketContext, "socket">>;
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
