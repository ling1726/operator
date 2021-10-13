import { useInterpret, useSelector } from "@xstate/react";
import { memo, useEffect } from "react";
import { makeStyles } from "@fluentui/react-components";
import { Switch, Route, Redirect } from "react-router-dom";
import { authSelector, useAuthService } from "../machines/auth";
import { socketMachine, socketSelector } from "../machines/socket";
import { Landing } from "./Landing";
import { Lobby } from "./Lobby";

const useStyles = makeStyles({
  pageDimensions: {
    maxWidth: "1260px",
    margin: "20px auto",
  },
});

export function App() {
  const styles = useStyles();
  const isConnected = useSelector(useAuthService(), authSelector.isConnected);
  return (
    <Switch>
      <main className={styles.pageDimensions}>
        <Route exact path="/">
          {isConnected ? <Redirect to="/lobby" /> : <Landing />}
        </Route>
        {isConnected ? <InternalRoutes /> : <Redirect to="/" />}
      </main>
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
