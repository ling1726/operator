import { useInterpret } from "@xstate/react";
import React from "react";
import {
  createMachine,
  actions,
  DoneInvokeEvent,
  AssignAction,
  Interpreter,
  State,
} from "xstate";

export type AuthEvent =
  | {
      type: "CONNECT";
      payload: { server: string; type: "host" | "join" };
    }
  | DoneInvokeEvent<string>
  | { type: "DISCONNECT" };

export interface AuthContext {
  socket?: WebSocket;
}

export type AuthTypestate =
  | {
      value: "disconnected";
      context: AuthContext & { socket: undefined };
    }
  | {
      value: "connecting";
      context: AuthContext & { socket: undefined };
    }
  | {
      value: "connected";
      context: AuthContext & { socket: WebSocket };
    };

export type AuthService = Interpreter<
  AuthContext,
  any,
  AuthEvent,
  AuthTypestate
>;

export type AuthState = State<AuthContext, AuthEvent, any, AuthTypestate>;

export const authMachine = createMachine<AuthContext, AuthEvent, AuthTypestate>(
  {
    id: "auth",
    initial: "disconnected",
    states: {
      disconnected: {
        entry: "unassignSocket",
        on: {
          CONNECT: "connecting",
        },
      },
      connecting: {
        invoke: {
          src: "connect",
          onDone: {
            target: "connected",
            actions: "assignSocket",
          },
          onError: "disconnected",
        },
      },
      connected: {
        on: {
          DISCONNECT: "disconnected",
        },
      },
    },
  },
  {
    actions: {
      unassignSocket: actions.assign<AuthContext, AuthEvent>({
        socket: undefined,
      }),
      assignSocket: actions.assign<AuthContext, DoneInvokeEvent<string>>(
        (_, { data: url }) => ({ socket: new WebSocket(url) })
      ) as AssignAction<AuthContext, AuthEvent>,
    },
    services: {
      connect: async () =>
        new Promise<string>((res) =>
          setTimeout(() => res("ws://localhost:8080"), 3000)
        ),
    },
  }
);

export const authSelector = {
  socket: (state: AuthState) => state.context.socket,
  isConnected: (state: AuthState) => state.matches("connected"),
  isConnecting: (state: AuthState) => state.matches("connecting"),
  isDisconnected: (state: AuthState) => state.matches("disconnected"),
};

const context = React.createContext<AuthService | undefined>(undefined);

export const AuthProvider = React.memo((props) => {
  const authService = useInterpret(authMachine);
  return <context.Provider {...props} value={authService} />;
});

export function useAuthService() {
  const authService = React.useContext(context);
  if (!authService) throw new Error("deu ruim no authService");
  return authService;
}
