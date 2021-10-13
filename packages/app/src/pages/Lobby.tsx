import { Label, Button } from "@fluentui/react-components";
import { useSelector } from "@xstate/react";
import React, { useCallback } from "react";
import { Redirect } from "react-router";
import { Center } from "../components/Center";
import { RegisterForm, RegisterFormData } from "../components/RegsiterForm";
import { gameSelector, useGameService } from "../machines/game";

export function Lobby() {
  const gameService = useGameService();
  const isIdle = useSelector(gameService, gameSelector.isIdle);
  const isRegistered = useSelector(gameService, gameSelector.isRegistered);
  const isPlaying = useSelector(gameService, gameSelector.isPlaying);
  const players = useSelector(gameService, gameSelector.players);
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
  if (isPlaying) return <Redirect to="/game" />;
  return (
    <Center>
      {isIdle && <RegisterForm onSubmit={handleSubmit} />}
      {Boolean(players.length) && (
        <div>
          <Label strong size="large">
            Players:
          </Label>
          <div>
            {players.map((player) => (
              <div key={player.id}>
                <Label size="medium">{player.displayName}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
      {isRegistered && (
        <Button onClick={handleReady} appearance="primary">
          Ready
        </Button>
      )}
    </Center>
  );
}
