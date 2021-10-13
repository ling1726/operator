import * as React from "react";
import { makeStyles} from "@fluentui/react-make-styles";
import { Divider } from "@fluentui/react-components";
import { faUser, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Displayable } from "../components/Displayable";
import { Scorebar } from "../components/Scorebar";

const exchanges = [
  { id: 0, displayName: "A" },
  { id: 1, displayName: "B" },
  { id: 2, displayName: "C" },
];

const attendants = [
  { id: 3, displayName: "Player 1" },
  { id: 4, displayName: "Player 2" },
  { id: 5, displayName: "Player 3" },
  { id: 6, displayName: "Player 4" },
  { id: 7, displayName: "Player 5" },
];

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
  },
});

export default function App() {
  const styles = useStyles();
  const [selectedExchange, setSelectedExchange] = React.useState<
    number | undefined
  >();
  const [selectedAttendant, setSelectedAttendant] = React.useState<
    number | undefined
  >();
  const [score, setScore] = React.useState<number>(100);

  // Make the score move around while no score received from the BE
  const intervalRef = React.useRef<number>(0);
  React.useEffect(() => {
    intervalRef.current = setInterval(() => setScore(Math.random()*100), 3000);

    return () => clearInterval(intervalRef.current);
  }, []);
  
  return (
    <div className={styles.grid}>
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
        {attendants.map((attendant) => (
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

      <Scorebar score={score} />
    </div>
  );
}
