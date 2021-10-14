import { Label, Button } from "@fluentui/react-components";
import { useSelector } from "@xstate/react";
import React, { useCallback } from "react";
import { Redirect } from "react-router";
import { Center } from "../components/Center";
import { RegisterForm, RegisterFormData } from "../components/RegsiterForm";
import { gameSelectors } from "../machines/game";
import { useGlobalServices } from "../machines/GlobalServicesProvider";

export function Lobby() {
  const { gameService } = useGlobalServices();
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
