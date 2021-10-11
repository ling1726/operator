import { Switch, Route } from "react-router-dom";
import { Landing } from "./Landing";
import { Lobby } from "./Lobby";

export function App() {
  return (
    <Switch>
      <Route exact path="/lobby">
        <Lobby />
      </Route>
      <Route exact path="/">
        <Landing />
      </Route>
    </Switch>
  );
}
