type ID = number;

export interface GameObject {
  id: ID;
  displayName: string;
}
export interface Player extends GameObject {
  ready: boolean;
}

export interface Exchange extends GameObject {}
export interface Attendee extends GameObject {}
export interface Mission extends GameObject {
  caller: Attendee;
  callee: Attendee;
  exchange: ID;
  timestamp: number;
  duration: number;
}

export type RegisterRequest = {
  type: "Register";
  payload: {
    username: string;
  };
};

export type ReadyRequest = {
  type: "Ready";
  payload: {};
};

export type LobbyResponse = {
  type: "Lobby";
  payload: {
    players: Player[];
  };
};

export type StartResponse = {
  type: "Start";
  payload: {
    exchanges: Exchange[];
    attendees: Attendee[];
    score: number;
    timestamp: number;
  };
};

export type MissionResponse = {
  type: "Mission";
  payload: Mission;
};

export type ConnectRequest = {
  type: "Connect";
  payload: {
    exchange: ID;
    attendee: ID;
  };
};

export type ScoreResponse = {
  type: "Score";
  payload: {
    score: number;
    exchange: ID;
    attendee: ID;
  };
};

export type GameOverResponse = {
  type: "GameOver";
  payload: { timestamp: number };
};

export type LaunchResponse = {
  type: "Launch";
  payload: {
    wsAddress: string;
  };
};

export type HTTPLaunchRequest = {
  username: string;
  server: string;
  type: "join" | "host";
};

export type Response =
  | LobbyResponse
  | StartResponse
  | MissionResponse
  | ScoreResponse
  | GameOverResponse
  | LaunchResponse;

export type Request = RegisterRequest | ReadyRequest | ConnectRequest;