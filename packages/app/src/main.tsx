import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./pages/App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter } from "react-router-dom";
import CSSBaseline from "@mui/material/CssBaseline";
import { WebSocketProvider } from "./hooks/useWebSocket";

ReactDOM.render(
  <React.StrictMode>
    <CSSBaseline />
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </BrowserRouter>
    </FluentProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
