export type Message = { type: string; payload: unknown };

type ID = number;

export interface LobbyResponsePayload {
  id: ID;
  displayName: string;
  ready: boolean;
}

export interface StartResponsePayload {
  exchanges: any[];
  attendees: any[];
}

export interface MissionResponsePayload {
  id: ID;
  caller: ID;
  callee: ID;
  exchange: ID;
  timestamp: number;
  duration: number;
  displayName: string;
}

export interface ConnectResponsePayload {
  exchange: ID;
  attendee: ID;
}

export interface ScoreResponsePayload {
  score: number;
  exchange: ID;
  attendee: ID;
}

export interface LaunchRequestPayload {
  username: string;
  server: string;
  type: "join" | "host";
}

export interface LaunchResponsePayload {
  wsAddress: string;
}

export type LobbyResponse = { type: "lobby"; payload: LobbyResponsePayload };
export type StartResponse = { type: "start"; payload: StartResponsePayload };
export type MissionResponse = {
  type: "mission";
  payload: MissionResponsePayload;
};
export type ConnectResponse = {
  type: "connect";
  payload: ConnectResponsePayload;
};
export type ScoreResponse = { type: "score"; payload: ScoreResponsePayload };
export type GameOverResponse = { type: "gameover"; payload: void };
export type LaunchResponse = { type: "launch"; payload: LaunchResponsePayload };
