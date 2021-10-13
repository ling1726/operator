import { useSelector } from "@xstate/react";
import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from '@fluentui/react-make-styles';
import { authSelector, useAuthService } from "../machines/auth";
import { Landing } from "./Landing";
import { Lobby } from "./Lobby";
import { Game } from "./Game";
import { GameProvider } from "../machines/game";

const useStyles = makeStyles({
  main: {
    maxWidth: '1260px',
    margin: '0 auto',
  }
});

export function App() {
  const isConnected = useSelector(useAuthService(), authSelector.isConnected);
  const styles = useStyles();
  return (
    <main className={styles.main}>
      <Switch>
        <Route exact path="/">
          {isConnected ? <Redirect to="/lobby" /> : <Landing />}
        </Route>
        <Route path="/over">
          Game Over
        </Route>
        {isConnected ? (
          <GameProvider>
            <Route exact path="/lobby">
              <Lobby />
            </Route>
            <Route path="/game">
              <Game />
            </Route>
          </GameProvider>
        ) : (
          <Redirect to="/" />
        )}
      </Switch>
    </main>
  );
}
