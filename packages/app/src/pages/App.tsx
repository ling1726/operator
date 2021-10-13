import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@fluentui/react-make-styles";
import { Landing } from "./Landing";
import { Lobby } from "./Lobby";
import Game from "./Game";
import { Scorebar } from "../components/Scorebar";
import { useWebSocket } from "../hooks/useWebSocket";

const useStyles = makeStyles({
  pageDimensions: {
    maxWidth: "1260px",
    margin: "20px auto",
  },
});

export function App() {
  const [message, { state }] = useWebSocket();
  const styles = useStyles();
  console.log(message, state);
  return (
    <div className={styles.pageDimensions}>
      <Switch>
        <Route exact path="/lobby">
          <Lobby />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
        <Route path="/test">
          <Scorebar score={70} />
        </Route>
        <Route exact path="/">
          {state === "OPEN" ? <Redirect to="/lobby" /> : <Landing />}
        </Route>
      </Switch>
    </div>
  );
}
