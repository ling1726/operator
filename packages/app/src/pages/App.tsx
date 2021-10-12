import { Switch, Route, Redirect } from "react-router-dom";
import { Landing } from "./Landing";
import { Lobby } from "./Lobby";
import { useWebSocket } from "../hooks/useWebSocket";

export function App() {
  const [message, { state }] = useWebSocket();
  console.log(message, state);
  return (
    <Switch>
      <Route exact path="/lobby">
        <Lobby />
      </Route>
      <Route path="/game">Game</Route>
      <Route exact path="/">
        {state === "OPEN" ? <Redirect to="/lobby" /> : <Landing />}
      </Route>
    </Switch>
  );
}
