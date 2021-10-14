import { memo } from "react";
import { Game } from "./Game";
import { Lobby } from "./Lobby";
import { Landing } from "./Landing";
import { Switch, Route } from "react-router-dom";

export const App = memo(() => (
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
));

App.displayName = "App";
