import { ActorRef, Interpreter, State } from "xstate";
import * as api from "../../api";
import { SocketEvent, SocketState } from "../socket";

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
