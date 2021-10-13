import { Label } from "@fluentui/react-components";
import { useSelector } from "@xstate/react";
import React, { useCallback } from "react";
import { Center } from "../components/Center";
import { RegisterForm, RegisterFormData } from "../components/RegsiterForm";
import { gameSelector, useGameService } from "../machines/game";

export function Lobby() {
  const gameService = useGameService();
  const isIdle = useSelector(gameService, gameSelector.isIdle);
  const username = useSelector(gameService, gameSelector.username);
  const handleSubmit = useCallback(
    (ev: React.FormEvent<HTMLFormElement>, payload: RegisterFormData) => {
      ev.preventDefault();
      gameService.send({ type: "REGISTER", payload });
    },
    [gameService]
  );
  return (
    <Center>
      {isIdle && <RegisterForm onSubmit={handleSubmit} />}
      {!isIdle && <Label size="large">Username: {username}</Label>}
    </Center>
  );
}
