import { Frame, TitleBar, Button, Fieldset } from "@react95/core";
import { Awschd32402 } from "@react95/icons";
import React, { memo } from "react";
import { Redirect } from "react-router";
import { Center } from "../components/Center";
import { PlayerList } from "../components/PlayerList";
import { RegisterForm } from "../components/RegsiterForm";
import { makeStyles } from "@fluentui/react-make-styles";
import { useLobby } from "../hooks/useLobby";
import { Displayable } from "../components/Displayable";
import { Avatar, Cutout} from "react95";
import { Mission } from "../components/Mission";

const useStyles = makeStyles({
  root: {
    maxWidth: "800px",
  },
  article: {
    padding: "20px",
    display: "flex",
    gap: "20px",
  },

  row: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },

  instructions: {
    textAlign: "justify",
    textJustify: "inter-word",
    display: "flex",
    flexDirection: "column",
    "& button": {
      marginTop: "auto",
    },
    maxHeight: "500px",
    padding: ' 10px',
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
      <Frame className={styles.root}>
        <TitleBar title="Lobby" active icon={<Awschd32402 variant="32x32_4" />}>
          <TitleBar.OptionsBox>
            <TitleBar.Option>?</TitleBar.Option>
            <TitleBar.Option>X</TitleBar.Option>
          </TitleBar.OptionsBox>
        </TitleBar>
        <article className={styles.article}>
          <PlayerList players={players} readyButtonDisabled={!isRegistered} onClickReadyButton={onReady} />
          <Cutout className={styles.instructions}>
            <h2>Instructions</h2>
            <p>
              You will manage a group of users who need their calls connected to
              the correct Teams call exchange.
              <br />
              <br />
              To start a connection, click either an exchange or a user. <strong>The
              object will have a <span style={{color: 'red'}}>red</span> outline once it has been selected</strong>. Simply
              select the second object to connect to to start the connection.
            </p>

            <div className={styles.row}>
              <Displayable
                checked
                displayName="David"
                onChange={() => null}
                id={0}
              >
                <Avatar src="https://avatars.dicebear.com/api/pixel-art/3.svg" />
              </Displayable>
              <Displayable
                checked
                displayName="Exchange"
                onChange={() => null}
                id={0}
              >
                <Awschd32402 variant="32x32_4" />
              </Displayable>
            </div>

            <p>
              Each call requires one of your operator colleagues to finish the
              connection on their side. It's up to you to let them know that the
              connection needs to be finished. Make sure to let them know !
              <p>
                <div className={styles.row}>
                  <Mission
                    id={1}
                    callee="callee"
                    caller="caller"
                    callerId={1}
                    name="Call to connect"
                    duration={180000}
                    exchange="New York"
                    onMissionTimeout={() => null}
                  />
                </div>
              </p>
              Each call must be connected during the given time limit or the QoS
              of Teams will fall to catastrophic levels. The progress of the
              timer and QoS are both visible on progress bars. Try to avoid them
              falling too low.
            </p>
          </Cutout>
        </article>
      </Frame>
    </Center>
  );
});

Lobby.displayName = "Lobby";
