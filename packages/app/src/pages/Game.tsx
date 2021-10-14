import * as React from "react";
import { makeStyles } from "@fluentui/react-make-styles";
import { Divider } from "@fluentui/react-components";
import { faUser, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Displayable } from "../components/Displayable";
import { Scorebar } from "../components/Scorebar";
import { Mission } from "../components/Mission";
import { useSelector } from "@xstate/react";
import { Redirect } from "react-router";
import { useGlobalServices } from "../machines/GlobalServicesProvider";
import { gameSelectors } from "../machines/game";

const useStyles = makeStyles({
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto 1rem auto",
    gap: "1rem 1rem",
    gridTemplateAreas: `
      "."
      "."
      "."
    `,
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
  },
});

export function Game() {
  const styles = useStyles();
  const { gameService } = useGlobalServices();
  const exchanges = useSelector(gameService, gameSelectors.exchanges);
  const attendees = useSelector(gameService, gameSelectors.attendees);
  const score = useSelector(gameService, gameSelectors.score);
  const mission = useSelector(gameService, gameSelectors.mission);
  const [selectedExchange, setSelectedExchange] = React.useState<
    number | undefined
  >();
  const [selectedAttendant, setSelectedAttendant] = React.useState<
    number | undefined
  >();

  const isGameOver = useSelector(gameService, gameSelectors.isGameOver);

  if (isGameOver) {
    return <Redirect to="/over" />;
  }

  return (
    <div className={styles.grid}>
      <div className={styles.row}>
        <Mission
          key={mission.id}
          onMissionTimeout={() => console.log("mission over")}
          name={mission.name}
          callee={mission.callee}
          caller={mission.caller}
          duration={mission.duration}
          exchange={exchanges[0].displayName}
        />
      </div>
      <Divider />
      <div className={styles.row}>
        {exchanges.map((exchange) => (
          <Displayable
            key={exchange.id}
            id={exchange.id}
            displayName={exchange.displayName}
            onChange={setSelectedExchange}
            icon={faPhone}
            checked={selectedExchange === exchange.id}
          />
        ))}
      </div>
      <Divider />
      <div className={styles.row}>
        {attendees.map((attendant) => (
          <Displayable
            key={attendant.id}
            id={attendant.id}
            displayName={attendant.displayName}
            onChange={setSelectedAttendant}
            icon={faUser}
            checked={selectedAttendant === attendant.id}
          />
        ))}
      </div>

      <Divider />
      <Scorebar score={score} />
    </div>
  );
}
