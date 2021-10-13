import { useInterpret, useSelector } from "@xstate/react";
import { createContext, memo, useContext, useEffect } from "react";
import {
  actions,
  ActorRef,
  AssignAction,
  createMachine,
  Interpreter,
  SendAction,
  spawn,
  State,
} from "xstate";
import { useAuthService } from "./auth";
import {
  SocketEvent,
  socketMachine,
  socketSelector,
  SocketState,
} from "./socket";

export type GameEvent =
  | {
      type: "REGISTER";
      payload: {
        username: string;
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
  socket: WebSocket;
  username?: string;
  socketRef: ActorRef<SocketEvent, SocketState>;
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
      value: "game_over";
      context: GameContext & Required<GameContext>;
    };

export type GameService = Interpreter<
  GameContext,
  any,
  GameEvent,
  GameTypestate
>;

export type GameState = State<GameContext, GameEvent, any, GameTypestate>;

export const gameMachine = createMachine<GameContext, GameEvent, GameTypestate>(
  {
    id: "game",
    initial: "idle",
    on: {
      ERROR: "error",
    },
    entry: "assignSocketRef",
    states: {
      idle: {
        on: {
          REGISTER: {
            target: "registered",
            actions: ["requestRegister", "assignUsername"],
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
          GAME_OVER: "game_over",
        },
      },
      game_over: {
        type: "final",
      },
      error: {
        type: "final",
      },
    },
  },
  {
    actions: {
      requestRegister: actions.send(
        (_, ev: Extract<GameEvent, { type: "REGISTER" }>): SocketEvent => ({
          type: "REQUEST",
          payload: ev,
        }),
        {
          to: (ctx) => ctx.socketRef,
        }
      ) as SendAction<GameContext, GameEvent, SocketEvent>,
      assignUsername: actions.assign(
        (_, ev: Extract<GameEvent, { type: "REGISTER" }>) => ({
          username: ev.payload.username,
        })
      ) as AssignAction<GameContext, GameEvent>,
      assignSocketRef: actions.assign(({ socket }) => ({
        socketRef: spawn(socketMachine.withContext({ socket })),
      })),
    },
  }
);

const context = createContext<GameService | undefined>(undefined);

export const gameSelector = {
  socketRef: (state: GameState) => state.context.socketRef,
  username: (state: GameState) => state.context.username,
  isIdle: (state: GameState) => state.matches("idle"),
  isRegistered: (state: GameState) => state.matches("registered"),
  isPlaying: (state: GameState) => state.matches("playing"),
  isGameOver: (state: GameState) => state.matches("game_over"),
};

export const GameProvider = memo((props) => {
  const authService = useAuthService();
  const gameService = useInterpret(gameMachine, {
    context: { socket: authService.state.context.socket },
  });
  const socketRef = useSelector(gameService, gameSelector.socketRef);
  const isClosed = useSelector(socketRef, (state) =>
    socketSelector.isClosed(state)
  );
  useEffect(() => {
    if (isClosed) authService.send("DISCONNECT");
  }, [isClosed, authService]);
  return <context.Provider {...props} value={gameService} />;
});

export function useGameService() {
  const gameService = useContext(context);
  if (!gameService) throw new Error("deu ruim no gameService");
  return gameService;
}
