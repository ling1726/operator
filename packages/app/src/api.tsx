type ID = number;

export type RegisterRequest = {
  type: "REGISTER";
  payload: {
    username: string;
  };
};

export type ReadyRequest = {
  type: "READY";
  payload: {};
};

export type LobbyResponse = {
  type: "lobby";
  payload: {
    id: ID;
    displayName: string;
    ready: boolean;
  }[];
};
export type StartResponse = {
  type: "start";
  payload: {
    exchanges: any[];
    attendees: any[];
  };
};
export type MissionResponse = {
  type: "mission";
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
  type: "connect";
  payload: {
    exchange: ID;
    attendee: ID;
  };
};
export type ScoreResponse = {
  type: "score";
  payload: {
    score: number;
    exchange: ID;
    attendee: ID;
  };
};
export type GameOverResponse = { type: "gameover"; payload: void };
export type LaunchResponse = {
  type: "launch";
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

export function send(ws: WebSocket, request: Request) {
  ws.send(JSON.stringify(request));
}
