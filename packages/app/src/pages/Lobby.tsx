import { Frame, TitleBar, Button } from "@react95/core";
import { Awschd32402 } from "@react95/icons";
import { useSelector } from "@xstate/react";
import React, { useCallback } from "react";
import { Redirect } from "react-router";
import { Center } from "../components/Center";
import { PlayerList } from "../components/PlayerList";
import { RegisterForm, RegisterFormData } from "../components/RegsiterForm";
import { gameSelectors } from "../machines/game";
import { useGlobalServices } from "../machines/GlobalServicesProvider";
import { makeStyles } from "@fluentui/react-components";
import { authSelectors } from "../machines/auth";

const useStyles = makeStyles({
  article: {
    padding: "20px",
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
  },
});

export function Lobby() {
  const {
    isPlaying,
    isIdle: isRegistering,
    isRegistered,
    isConnected,
    players,
    onReady,
    onSubmit,
  } = useLobby();
  const styles = useStyles();
  if (!isConnected) return <Redirect to="/" />;
  if (isPlaying) return <Redirect to="/game" />;
  if (isRegistering) {
    return (
      <Center>
        <RegisterForm onSubmit={onSubmit} />
      </Center>
    );
  }
  return (
    <Center>
      <Frame>
        <TitleBar title="Lobby" active icon={<Awschd32402 variant="32x32_4" />}>
          <TitleBar.OptionsBox>
            <TitleBar.Option>?</TitleBar.Option>
            <TitleBar.Option>X</TitleBar.Option>
          </TitleBar.OptionsBox>
        </TitleBar>
        <article className={styles.article}>
          <PlayerList players={players} />
          <Button disabled={!isRegistered} onClick={onReady}>
            Ready
          </Button>
        </article>
      </Frame>
    </Center>
  );
}

function useLobby() {
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
