import { useInterpret, useSelector } from "@xstate/react";
import { createContext, memo, useContext, useEffect } from "react";
import {
  ActorRef,
  assign,
  AssignAction,
  createMachine,
  Interpreter,
  send,
  SendAction,
  spawn,
  State,
} from "xstate";
import * as api from "../api";
import { useAuthService } from "./auth";
import {
  SocketEvent,
  socketMachine,
  socketSelector,
  SocketState,
} from "./socket";

export type GameEvent =
  | api.RegisterRequest
  | api.LobbyResponse
  | api.ReadyRequest
  | api.StartResponse
  | api.MissionResponse
  | api.ConnectResponse
  | api.ScoreResponse
  | api.GameOverResponse
  | {
      type: "Error";
      payload: Event;
    };

export interface GameContext {
  socket: WebSocket;
  username?: string;
  socketRef: ActorRef<SocketEvent, SocketState>;
  players: api.Player[];
  exchanges: api.Exchange[];
  attendees: api.Attendee[];
  score: number;
  mission: api.Mission;
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
      Error: "error",
    },
    entry: "assignSocketRef",
    states: {
      idle: {
        on: {
          Register: {
            target: "registered",
            actions: ["requestRegister", "assignUsername"],
          },
        },
      },
      registered: {
        on: {
          Lobby: {
            actions: "assignLobby",
          },
          Ready: {
            actions: "sendSocketReady",
          },
          Start: {
            target: "playing",
            actions: ["assignExchanges", "assignAttendees", "assignScore"],
          },
        },
      },
      playing: {
        on: {
          Mission: {
            actions: "assignMission",
          },
          Score: {
            actions: "assignScore",
          },
          Connect: {},
          GameOver: "game_over",
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
      sendSocketReady: send<GameContext, api.ReadyRequest, SocketEvent>(
        (_, ev) => ({
          type: "REQUEST",
          payload: ev,
        }),
        { to: "socket" }
      ) as SendAction<GameContext, GameEvent, SocketEvent>,
      assignExchanges: assign((_, ev: api.StartResponse) => ({ exchanges: ev.payload.exchanges } )) as AssignAction<GameContext, GameEvent>,
      assignAttendees: assign((_, ev: api.StartResponse) => ({ attendees: ev.payload.attendees } )) as AssignAction<GameContext, GameEvent>,
      assignScore: assign((_, ev: api.StartResponse) => ({ score: ev.payload.score} )) as AssignAction<GameContext, GameEvent>,
      assignMission: assign((_, ev: api.MissionResponse) => ({ mission: ev.payload } )) as AssignAction<GameContext, GameEvent>,
      assignLobby: assign((_, ev: api.LobbyResponse) => ({
        players: ev.payload.players,
      })) as AssignAction<GameContext, GameEvent>,
      requestRegister: send(
        (_, ev: Extract<GameEvent, { type: "Register" }>): SocketEvent => ({
          type: "REQUEST",
          payload: ev,
        }),
        {
          to: (ctx) => ctx.socketRef,
        }
      ) as SendAction<GameContext, GameEvent, SocketEvent>,
      assignUsername: assign(
        (_, ev: Extract<GameEvent, { type: "Register" }>) => ({
          username: ev.payload.username,
        })
      ) as AssignAction<GameContext, GameEvent>,
      assignSocketRef: assign(({ socket }) => ({
        socketRef: spawn(socketMachine.withContext({ socket }), "socket"),
      })),
    },
  }
);

const context = createContext<GameService | undefined>(undefined);

const defaultPlayers: api.Player[] = [];

export const gameSelector = {
  socketRef: (state: GameState) => state.context.socketRef,
  players: (state: GameState) => state.context.players ?? defaultPlayers,
  username: (state: GameState) => state.context.username,
  isIdle: (state: GameState) => state.matches("idle"),
  isRegistered: (state: GameState) => state.matches("registered"),
  isPlaying: (state: GameState) => state.matches("playing"),
  isGameOver: (state: GameState) => state.matches("game_over"),
  exchanges: (state: GameState) => state.context.exchanges,
  attendees: (state: GameState) => state.context.attendees,
  // BE score starts from 0
  score: (state: GameState) => 100-state.context.score,
  mission: (state: GameState) => {
    const exchangeName = state.context.exchanges.find(x => x.id === state.context.mission?.exchange)?.displayName;

    if (!exchangeName || !state.context.mission) {
      console.error('Cannot find game objects in client, please report this error');
      return {
        name: '',
        caller: '',
        callee: '',
        exchange: '',
        duration: 3000,
        id: 1,
      };
    }

    const mission = state.context.mission;

    return {
      name: mission.displayName,
      duration: mission.duration,
      caller: mission.caller.displayName,
      callee: mission.callee.displayName,
      exchange: exchangeName,
      id: state.context.mission.id,
    }
  }
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
