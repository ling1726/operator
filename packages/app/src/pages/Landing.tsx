import * as React from "react";
import { LaunchForm, LaunchFormData } from "../components/LaunchForm";
import { Center } from "../components/Center";
import { useActor, useSelector } from "@xstate/react";
import { useGlobalServices } from "../machines/GlobalServicesProvider";
import { Redirect } from "react-router";
import { gameSelectors } from "../machines/game";
import { socketSelectors } from "../machines/socket";
import { authSelectors } from "../machines/auth";

export function Landing() {
  const { authService, gameService } = useGlobalServices();
  const socketRef = useSelector(gameService, gameSelectors.socketRef);
  const socketURL = useSelector(authService, authSelectors.socketURL);
  const isConnecting = useSelector(authService, authSelectors.isConnecting);
  const isConnected = useSelector(authService, authSelectors.isConnected);
  const isOpen = useSelector(socketRef, (state) => {
    return state.matches("available.open");
  });
  const isSocketConnecting = useSelector(socketRef, (state) =>
    state.matches("available.connecting")
  );
  const handleSubmit = React.useCallback(
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

  React.useEffect(() => {
    if (isConnected && socketURL) {
      socketRef.send({
        type: "CONNECT",
        payload: { url: socketURL },
      });
    }
  }, [isConnected, socketRef, socketURL]);

  if (isOpen) return <Redirect to="/lobby" />;
  return (
    <Center>
      <LaunchForm
        loading={isConnecting || isSocketConnecting}
        onSubmit={handleSubmit}
      />
    </Center>
  );
}
