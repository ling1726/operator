import * as React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-make-styles";
import { Displayable } from "../components/Displayable";
import { ScoreBar } from "../components/ScoreBar";
import { Mission } from "../components/Mission";
import { Redirect } from "react-router";
import { Awschd32402 } from "@react95/icons";
import { Frame, TitleBar } from "@react95/core";
import { Divider, Avatar } from "react95";
import { Center } from "../components/Center";
import { useGame } from "../hooks/useGame";

const useStyles = makeStyles({
  grid: {
    display: "flex",
    flexDirection: "column",
  },
  rowExchanges: {
    gap: "50px",
  },

  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
  },

  container: {
    height: "100vh",
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    justifyContent: "center",
    // alignItems: "center",
  },
});

export const Game = React.memo(() => {
  const styles = useStyles();
  const {
    isGameOver,
    mission,
    score,
    exchanges,
    attendees,
    selectedAttendant,
    selectedExchange,
    setSelectedAttendant,
    setSelectedExchange,
  } = useGame();

  if (isGameOver) return <Redirect to="/" />;

  return (
    <Center className={styles.container}>
      <Frame>
        <TitleBar
          active
          icon={<Awschd32402 variant="32x32_4" />}
          title="Operator"
          className="draggable"
        >
          <TitleBar.OptionsBox>
            <TitleBar.Option>?</TitleBar.Option>
            <TitleBar.Option>X</TitleBar.Option>
          </TitleBar.OptionsBox>
        </TitleBar>
        <div style={{ display: "flex", padding: "10px" }}>
          <Mission
            key={mission.id}
            id={mission.id}
            onMissionTimeout={() => console.log("mission over")}
            name={mission.name}
            callerId={mission.callerId}
            callee={mission.callee}
            caller={mission.caller}
            duration={mission.duration}
            exchange={mission.exchange}
          />
          <div className={styles.grid}>
            <div className={mergeClasses(styles.row, styles.rowExchanges)}>
              {exchanges.map((exchange) => (
                <Displayable
                  key={exchange.id}
                  id={exchange.id}
                  displayName={exchange.displayName}
                  onChange={setSelectedExchange}
                  checked={selectedExchange === exchange.id}
                >
                  <Awschd32402 variant="32x32_4" />
                </Displayable>
              ))}
            </div>
            <Divider style={{ margin: "10px 0 10px 0" }} />
            <div className={styles.row}>
              {attendees.map((attendant) => (
                <Displayable
                  key={attendant.id}
                  id={attendant.id}
                  displayName={attendant.displayName}
                  onChange={setSelectedAttendant}
                  checked={selectedAttendant === attendant.id}
                >
                  <Avatar
                    src={`https://avatars.dicebear.com/api/pixel-art/${attendant.id}.svg`}
                  />
                </Displayable>
              ))}
            </div>
            <ScoreBar score={score} />
          </div>
        </div>
      </Frame>
    </Center>
  );
});

Game.displayName = "Game";
