import { useSelector } from "@xstate/react";
import { useCallback } from "react";
import { useGlobalServices } from "../components/GlobalServicesProvider";
import { RegisterFormData } from "../components/RegsiterForm";
import { authSelectors } from "../machines/auth";
import { gameSelectors } from "../machines/game";

export function useLobby() {
  const { gameService, authService } = useGlobalServices();
  const isConnected = useSelector(authService, authSelectors.isConnected);
  const isIdle = useSelector(gameService, gameSelectors.isIdle);
  const isRegistered = useSelector(gameService, gameSelectors.isRegistered);
  const isPlaying = useSelector(gameService, gameSelectors.isPlaying);
  const players = useSelector(gameService, gameSelectors.players);
  const handleSubmit = useCallback(
    (ev: React.FormEvent<HTMLFormElement>, payload: RegisterFormData) => {
      ev.preventDefault();
      gameService.send({ type: "Register", payload });
    },
    [gameService]
  );
  const handleReady = useCallback(() => {
    gameService.send({ type: "Ready", payload: {} });
  }, []);
  return {
    isConnected,
    isRegistered,
    isPlaying,
    isIdle,
    players,
    onReady: handleReady,
    onSubmit: handleSubmit,
  } as const;
}
