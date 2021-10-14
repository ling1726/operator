import { AuthState } from "./types";

export const authSelectors = {
  socketURL: (state: AuthState) => state.context.socketURL,
  isConnected: (state: AuthState) => state.matches("connected"),
  isConnecting: (state: AuthState) => state.matches("connecting"),
  isDisconnected: (state: AuthState) => state.matches("disconnected"),
};
