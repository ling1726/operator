import { useInterpret, useSelector } from "@xstate/react";
import { createContext, memo, useContext, useEffect, useMemo } from "react";
import { authMachine, AuthService } from "../machines/auth";
import { gameMachine, gameSelectors, GameService } from "../machines/game";
import { socketSelectors } from "../machines/socket";

export interface GlobalServicesContextValue {
  authService: AuthService;
  gameService: GameService;
}

const GlobalServicesContext = createContext<
  GlobalServicesContextValue | undefined
>(undefined);

export const GlobalServicesProvider = memo((props) => {
  const authService = useInterpret(authMachine);
  const gameService = useInterpret(gameMachine);
  const socketRef = useSelector(gameService, gameSelectors.socketRef);
  const isClosed = useSelector(socketRef, (state) =>
    socketSelectors.isClosed(state)
  );
  useEffect(() => {
    if (isClosed) authService.send("DISCONNECT");
  }, [isClosed, authService]);
  const value = useMemo<GlobalServicesContextValue>(
    () => ({ authService, gameService }),
    [authService, gameService]
  );
  return <GlobalServicesContext.Provider {...props} value={value} />;
});

GlobalServicesProvider.displayName = "GlobalServicesProvider";

export function useGlobalServices() {
  const globalServices = useContext(GlobalServicesContext);
  if (!globalServices) {
    throw new Error("useGlobalServices outside GlobalServicesProvider");
  }
  return globalServices;
}
