import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./pages/App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter } from "react-router-dom";
import CSSBaseline from "@mui/material/CssBaseline";
import { GlobalServicesProvider } from "./machines/GlobalServicesProvider";
import { ThemeProvider } from '@react95/core';
import '@react95/icons/icons.css';

ReactDOM.render(
  <React.StrictMode>
    <CSSBaseline />
    <FluentProvider theme={webLightTheme}>
      <ThemeProvider>
      <BrowserRouter>
        <GlobalServicesProvider>
          <App />
        </GlobalServicesProvider>
      </BrowserRouter>
      </ThemeProvider>
    </FluentProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
