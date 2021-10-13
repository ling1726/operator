type ID = number;

export interface Player {
  id: ID;
  displayName: string;
  ready: boolean;
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
    exchanges: any[];
    attendees: any[];
  };
};

export type MissionResponse = {
  type: "Mission";
  payload: {
    id: ID;
    caller: ID;
    callee: ID;
    exchange: ID;
    timestamp: number;
    duration: number;
    displayName: string;
  };
};

export type ConnectResponse = {
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

export type GameOverResponse = { type: "GameOver"; payload: void };

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
  | ConnectResponse
  | ScoreResponse
  | GameOverResponse
  | LaunchResponse;

export type Request = RegisterRequest | ReadyRequest;
