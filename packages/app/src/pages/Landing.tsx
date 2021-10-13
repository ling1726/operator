import * as React from "react";
import { LaunchForm, LaunchFormData } from "../components/LaunchForm";
import { Center } from "../components/Center";
import { useSelector } from "@xstate/react";
import { authSelector, useAuthService } from "../machines/auth";

export function Landing() {
  const authService = useAuthService();
  const isConnecting = useSelector(authService, authSelector.isConnecting);
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

  return (
    <Center>
      <LaunchForm loading={isConnecting} onSubmit={handleSubmit} />
    </Center>
  );
}
