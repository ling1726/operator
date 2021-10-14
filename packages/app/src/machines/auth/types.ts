import { DoneInvokeEvent, Interpreter, State } from "xstate";

export type AuthEvent =
  | {
      type: "CONNECT";
      payload: { server: string; type: "host" | "join" };
    }
  | DoneInvokeEvent<string>
  | { type: "DISCONNECT" };

export interface AuthContext {
  socketURL?: string;
}

export type AuthTypestate =
  | {
      value: "disconnected";
      context: AuthContext & { socketURL: undefined };
    }
  | {
      value: "connecting";
      context: AuthContext & { socketURL: undefined };
    }
  | {
      value: "connected";
      context: AuthContext & { socketURL: string };
    };

export type AuthService = Interpreter<
  AuthContext,
  any,
  AuthEvent,
  AuthTypestate
>;

export type AuthState = State<AuthContext, AuthEvent, any, AuthTypestate>;
