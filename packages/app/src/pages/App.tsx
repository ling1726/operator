import { memo } from "react";
import { Game } from "./Game";
import { Lobby } from "./Lobby";
import { Landing } from "./Landing";
import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { useGlobalServices } from "../machines/GlobalServicesProvider";
import { authSelectors } from "../machines/auth";

export const App = memo(() => (
  <Switch>
    <Route exact path="/">
      <Landing />
    </Route>
    {!useSelector(
      useGlobalServices().authService,
      authSelectors.isConnected
    ) && <Redirect to="/" />}
    <Route path="/over">Game Over</Route>
    <Route exact path="/lobby">
      <Lobby />
    </Route>
    <Route path="/game">
      <Game />
    </Route>
  </Switch>
));

App.displayName = "App";
