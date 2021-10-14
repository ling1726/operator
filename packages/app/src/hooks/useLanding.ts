import { LaunchForm, LaunchFormData } from "../components/LaunchForm";
import { Center } from "../components/Center";
import { useSelector } from "@xstate/react";
import { useGlobalServices } from "../machines/GlobalServicesProvider";
import { gameSelectors } from "../machines/game";
import { socketSelectors } from "../machines/socket";
import { authSelectors } from "../machines/auth";
import { useCallback, useEffect } from "react";

export function useLanding() {
  const { authService, gameService } = useGlobalServices();
  const socketRef = useSelector(gameService, gameSelectors.socketRef);
  const socketURL = useSelector(authService, authSelectors.socketURL);
  const isConnecting = useSelector(authService, authSelectors.isConnecting);
  const isConnected = useSelector(authService, authSelectors.isConnected);
  const isOpen = useSelector(socketRef, (state) =>
    socketSelectors.isOpen(state)
  );
  const isSocketConnecting = useSelector(socketRef, (state) =>
    socketSelectors.isConnecting(state)
  );
  const isUnavailable = useSelector(socketRef, (state) =>
    socketSelectors.isUnavailable(state)
  );
  const handleSubmit = useCallback(
    (
      ev: React.FormEvent<HTMLFormElement>,
      { serverName, type }: LaunchFormData
    ) => {
      ev.preventDefault();
      authService.send({
        type: "CONNECT",
        payload: { server: serverName, type },
      });
    },
    [authService]
  );

  useEffect(() => {
    if (isUnavailable) {
      authService.send("DISCONNECT");
    }
  }, [isUnavailable]);

  useEffect(() => {
    if (isConnected && socketURL) {
      socketRef.send({
        type: "CONNECT",
        payload: { url: socketURL },
      });
    }
  }, [isConnected, socketRef, socketURL]);

  return {
    loading: isConnecting || isSocketConnecting,
    redirect: isOpen,
    onSubmit: handleSubmit,
  } as const;
}
