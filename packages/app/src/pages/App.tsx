import { useSelector } from "@xstate/react";
import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from "@fluentui/react-make-styles";
import { Landing } from "./Landing";
import { Lobby } from "./Lobby";
import { Game } from "./Game";

const useStyles = makeStyles({
  main: {
    maxWidth: "1260px",
    margin: "0 auto",
  },
});

export function App() {
  const styles = useStyles();
  return (
    <main className={styles.main}>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route path="/over">Game Over</Route>
        <Route exact path="/lobby">
          <Lobby />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
      </Switch>
    </main>
  );
}
