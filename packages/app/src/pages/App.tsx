import { useInterpret, useSelector } from "@xstate/react";
import { memo, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { authSelector, useAuthService } from "../machines/auth";
import { socketMachine, socketSelector } from "../machines/socket";
import { Landing } from "./Landing";
import { Lobby } from "./Lobby";

export function App() {
  const isConnected = useSelector(useAuthService(), authSelector.isConnected);
  return (
    <Switch>
      <Route exact path="/">
        {isConnected ? <Redirect to="/lobby" /> : <Landing />}
      </Route>
      {isConnected ? <InternalRoutes /> : <Redirect to="/" />}
    </Switch>
  );
}

const InternalRoutes = memo(() => {
  const authService = useAuthService();
  const socket = useSelector(useAuthService(), authSelector.socket);
  const socketService = useInterpret(socketMachine, { context: { socket } });
  const isClosed = useSelector(socketService, socketSelector.isClosed);
  useEffect(() => {
    if (isClosed) authService.send("DISCONNECT");
  }, [isClosed, authService]);
  return (
    <>
      <Route exact path="/lobby">
        <Lobby />
      </Route>
      <Route path="/game">Game</Route>
    </>
  );
});
