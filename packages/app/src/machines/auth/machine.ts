import { createMachine, actions, DoneInvokeEvent, AssignAction } from "xstate";
import { AuthContext, AuthEvent, AuthTypestate } from "./types";

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
        socketURL: undefined,
      }),
      assignSocket: actions.assign<AuthContext, DoneInvokeEvent<string>>(
        (_, { data: url }) => ({ socketURL: url })
      ) as AssignAction<AuthContext, AuthEvent>,
    },
    services: {
      connect: async () => import.meta.env.VITE_WS_HOST,
    },
  }
);
