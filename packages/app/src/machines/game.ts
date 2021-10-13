import {
  ActionFunction,
  actions,
  AssignAction,
  createMachine,
  Interpreter,
  Receiver,
} from "xstate";
import * as api from "../api";

export type GameEvent =
  | {
      type: "REGISTER";
      payload: {
        username: string;
        socket: WebSocket;
      };
    }
  | {
      type: "LOBBY";
      payload: { players: any[] };
    }
  | {
      type: "READY";
    }
  | {
      type: "START";
      payload: any;
    }
  | {
      type: "MISSION";
      payload: any;
    }
  | {
      type: "CONNECT";
      payload: any;
    }
  | {
      type: "SCORE_UPDATE";
      payload: any;
    }
  | {
      type: "GAME_OVER";
    }
  | {
      type: "ERROR";
      payload: Event;
    };

export interface GameContext {
  username?: string;
  socket: WebSocket;
}

export type GameTypestate =
  | {
      value: "idle";
      context: GameContext & { username: undefined };
    }
  | {
      value: "registered";
      context: GameContext & Required<GameContext>;
    }
  | {
      value: "playing";
      context: GameContext & Required<GameContext>;
    }
  | {
      value: "gameover";
      context: GameContext & Required<GameContext>;
    };

export type GameService = Interpreter<
  GameContext,
  any,
  GameEvent,
  GameTypestate
>;

export const gameMachine = createMachine<GameContext, GameEvent, GameTypestate>(
  {
    id: "game",
    initial: "idle",
    invoke: {
      src: "socket",
    },
    on: {
      ERROR: "error",
    },
    states: {
      idle: {
        on: {
          REGISTER: {
            target: "registered",
            actions: actions.assign((_, { payload }) => payload),
          },
        },
      },
      registered: {
        on: {
          LOBBY: {},
          READY: {},
          START: "playing",
        },
      },
      playing: {
        on: {
          MISSION: {},
          CONNECT: {},
          GAME_OVER: "gameover",
        },
      },
      gameover: {
        type: "final",
      },
      error: {
        type: "final",
      },
    },
  },
  {
    services: {
      socket: (ctx) => (send) => {
        const listener = (ev: Event) => send({ type: "ERROR", payload: ev });
        ctx.socket.addEventListener("error", listener);
        return () => ctx.socket.removeEventListener("error", listener);
      },
    },
  }
);
