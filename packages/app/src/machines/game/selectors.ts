import * as api from "../../api";
import { GameState } from "./types";

const defaultPlayers: api.Player[] = [];

export const gameSelectors = {
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
  score: (state: GameState) => 100 - state.context.score,
  startTimestamp: (state: GameState) => state.context.startTimestamp,
  endTimestamp: (state: GameState) => state.context.endTimestamp,
  mission: (state: GameState) => {
    const exchangeName = state.context.exchanges.find(
      (x) => x.id === state.context.mission?.exchange
    )?.displayName;

    if (!exchangeName || !state.context.mission) {
      console.error(
        "Cannot find game objects in client, please report this error"
      );
      return {
        name: "",
        caller: "",
        callee: "",
        exchange: "",
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
    };
  },
};
