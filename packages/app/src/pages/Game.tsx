import * as React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-make-styles";
import { Displayable } from "../components/Displayable";
import { Scorebar } from "../components/Scorebar";
import { Mission } from "../components/Mission";
import { useSelector } from "@xstate/react";
import { Redirect } from "react-router";
import { useGlobalServices } from "../machines/GlobalServicesProvider";
import { gameSelectors } from "../machines/game";
import { Awschd32402, User } from "@react95/icons";
import { Frame, TitleBar } from "@react95/core";
// @ts-ignore
import { Divider, Avatar } from "react95";
import { Center } from "../components/Center";

const useStyles = makeStyles({
  grid: {
    display: "flex",
    flexDirection: "column",
  },
  rowExchanges: {
    gap: '50px',
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

export function Game() {
  const styles = useStyles();
  const { gameService } = useGlobalServices();
  const exchanges = useSelector(gameService, gameSelectors.exchanges);
  const attendees = useSelector(gameService, gameSelectors.attendees);
  const score = useSelector(gameService, gameSelectors.score);
  const mission = useSelector(gameService, gameSelectors.mission);
  const isGameOver = useSelector(gameService, gameSelectors.isGameOver);
  console.log("rerender");
  const [selectedExchange, setSelectedExchange] = React.useState<
    number | undefined
  >();
  const [selectedAttendant, setSelectedAttendant] = React.useState<
    number | undefined
  >();

  React.useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-displayable="true"]')) {
        setSelectedExchange(undefined);
        setSelectedAttendant(undefined);
      }
    };

    document.addEventListener("click", listener);

    return () => document.removeEventListener("click", listener);
  }, [setSelectedExchange, setSelectedAttendant]);

  React.useEffect(() => {
    if (selectedExchange && selectedAttendant) {
      console.log(gameService.state.context.socketRef.getSnapshot());
      console.log(gameService.state.value);
      gameService.send({
        type: "Connect",
        payload: { exchange: selectedExchange, attendee: selectedAttendant },
      });
      setSelectedAttendant(undefined);
      setSelectedExchange(undefined);
    }
  }, [selectedExchange, selectedAttendant]);

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
            onMissionTimeout={() => console.log("mission over")}
            name={mission.name}
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
            <Scorebar score={score} />
          </div>
        </div>
      </Frame>
    </Center>
  );
}
