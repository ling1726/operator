import { Frame, TitleBar, Button } from "@react95/core";
import { Awschd32402 } from "@react95/icons";
import { useSelector } from "@xstate/react";
import React, { memo, useCallback } from "react";
import { Redirect } from "react-router";
import { Center } from "../components/Center";
import { PlayerList } from "../components/PlayerList";
import { RegisterForm, RegisterFormData } from "../components/RegsiterForm";
import { gameSelectors } from "../machines/game";
import { useGlobalServices } from "../components/GlobalServicesProvider";
import { makeStyles } from "@fluentui/react-make-styles";
import { authSelectors } from "../machines/auth";
import { useLobby } from "../hooks/useLobby";

const useStyles = makeStyles({
  article: {
    padding: "20px",
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
  },
});

export const Lobby = memo(() => {
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
});

Lobby.displayName = "Lobby";
