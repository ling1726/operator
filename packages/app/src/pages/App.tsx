import { useSelector } from "@xstate/react";
import { Switch, Route, Redirect } from "react-router-dom";
import { authSelector, useAuthService } from "../machines/auth";
import { Landing } from "./Landing";
import { Lobby } from "./Lobby";
import { GameProvider } from "../machines/game";

export function App() {
  const isConnected = useSelector(useAuthService(), authSelector.isConnected);
  return (
    <Switch>
      <Route exact path="/">
        {isConnected ? <Redirect to="/lobby" /> : <Landing />}
      </Route>
      {isConnected ? (
        <GameProvider>
          <Route exact path="/lobby">
            <Lobby />
          </Route>
          <Route path="/game">Game</Route>
        </GameProvider>
      ) : (
        <Redirect to="/" />
      )}
    </Switch>
  );
}
