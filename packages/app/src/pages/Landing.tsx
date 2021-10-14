import { LaunchForm } from "../components/LaunchForm";
import { Center } from "../components/Center";
import { Redirect } from "react-router";
import { makeStyles } from "@fluentui/react-make-styles";
import { memo } from "react";
import { useLanding } from "../hooks/useLanding";
import { Frame, TitleBar } from "@react95/core";
import { Awschd32402 } from "@react95/icons";
import { GameOverDialog } from "../components/GameOverDialog";

const useStyles = makeStyles({
  root: {
    maxWidth: "600px",
  },
  frame: {
    padding: "0 20px 20px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateRows: "repeat(2, 1fr)",
    alignItems: "center",
  },
  titleBar: {
    width: "100%",
  },
  image: {
    gridArea: "1 / 1 / 3 / 2",
    display: "block",
    height: "400px",
    width: "200px",
    backgroundImage: `url('https://i.pinimg.com/originals/7c/d0/9e/7cd09e9f8e5c461aeb69a3a0b4b3df00.png')`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "initial",
    backgroundPosition: "center",
    backgroundSize: "400px",
  },
  paragraph: {
    textAlign: "justify",
    textJustify: "inter-word",
  },
});

export const Landing = memo(() => {
  const styles = useStyles();
  const {
    goToLobby,
    loading,
    startTimestamp,
    endTimestamp,
    isGameOver,
    onPlayAgain,
    onSubmit,
  } = useLanding();
  if (goToLobby && !isGameOver) return <Redirect to="/lobby" />;
  return (
    <>
      <Center>
        <Frame className={styles.root}>
          <TitleBar
            active
            icon={<Awschd32402 variant="32x32_4" />}
            title="Operator"
            className={styles.titleBar}
          >
            <TitleBar.OptionsBox>
              <TitleBar.Option>?</TitleBar.Option>
              <TitleBar.Option>X</TitleBar.Option>
            </TitleBar.OptionsBox>
          </TitleBar>
          <article className={styles.frame}>
            <span className={styles.image} />
            <p className={styles.paragraph}>
              Oh no! The Teams servers have been taken down by evil hacking kittens 🐱🐱.
              Activating emergency call routing protocol...

              <br />
              <br />
              ...[PLEASE INSERT DISK INTO DRIVE A:]
              <br />
              <br />
              Looks like Howard's original floppy disk with the routing algorithm no longer exists!
              <br />
              <br />
              <strong>Quick, route the incoming calls!</strong>
            </p>
            {!isGameOver && (
              <LaunchForm loading={loading} onSubmit={onSubmit} />
            )}
          </article>
        </Frame>
      </Center>
      <GameOverDialog
        onPlayAgain={onPlayAgain}
        startTimestamp={startTimestamp}
        endTimestamp={endTimestamp}
        open={isGameOver}
      />
    </>
  );
});

Landing.displayName = "Landing";
