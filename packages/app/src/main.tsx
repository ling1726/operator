import "normalize.css";
import "@react95/icons/icons.css";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./pages/App";
import {
  FluentProvider,
  webLightTheme,
  Theme,
} from "@fluentui/react-components";
import { BrowserRouter } from "react-router-dom";
import { GlobalServicesProvider } from "./machines/GlobalServicesProvider";
import { ThemeProvider } from "@react95/core";

const theme: Theme = { ...webLightTheme, colorNeutralBackground1: "#55aaaa" };

ReactDOM.render(
  <React.StrictMode>
    <FluentProvider theme={theme}>
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
