import * as React from "react";

export interface GameContextValue {
  players: Record<string, unknown>;
  exchanges: Record<string, unknown>;
  attendees: Record<string, unknown>;
  mission: unknown;
}

export const context = React.createContext<GameContextValue | undefined>(
  undefined
);
