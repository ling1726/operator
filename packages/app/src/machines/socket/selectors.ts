import { SocketState } from "./types";

export const socketSelectors = {
  isUnavailable: (state: SocketState) => state.matches("unavailable"),
  isConnecting: (state: SocketState) => state.matches("available.connecting"),
  isOpen: (state: SocketState) => state.matches("available.open"),
  isClosing: (state: SocketState) => state.matches("available.closing"),
  isClosed: (state: SocketState) => state.matches("available.closed"),
} as const;
