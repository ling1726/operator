import {
  ActorRef,
  assign,
  AssignAction,
  createMachine,
  send,
  SendAction,
  spawn,
} from "xstate";
import * as api from "../../api";
import { SocketEvent, socketMachine, SocketState } from "../socket";
import { GameContext, GameEvent, GameTypestate } from "./types";

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
          Connect: {
            actions: "requestConnect",
          },
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
      assignExchanges: assign((_, ev: api.StartResponse) => ({
        exchanges: ev.payload.exchanges,
      })) as AssignAction<GameContext, GameEvent>,
      assignAttendees: assign((_, ev: api.StartResponse) => ({
        attendees: ev.payload.attendees,
      })) as AssignAction<GameContext, GameEvent>,
      assignScore: assign((_, ev: api.StartResponse) => ({
        score: ev.payload.score,
      })) as AssignAction<GameContext, GameEvent>,
      assignMission: assign((_, ev: api.MissionResponse) => ({
        mission: ev.payload,
      })) as AssignAction<GameContext, GameEvent>,
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
      requestConnect: send(
        (_, ev: Extract<GameEvent, { type: "Connect" }>): SocketEvent => ({
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
      assignSocketRef: assign<GameContext, GameEvent>(() => ({
        socketRef: spawn(socketMachine, "socket") as ActorRef<
          SocketEvent,
          SocketState
        >,
      })),
    },
  }
);
