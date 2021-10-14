import "normalize.css";
import "@react95/icons/icons.css";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./pages/App";
import { BrowserRouter } from "react-router-dom";
import { GlobalServicesProvider } from "./machines/GlobalServicesProvider";
import { ThemeProvider } from "@react95/core";
import { ThemeProvider as SCThemeProvider } from "styled-components";

// pick a theme of your choice
// @ts-ignore
import original from "react95/dist/themes/original";
import { GlobalStyles } from "./components/GlobalStyles";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <SCThemeProvider theme={original}>
      <ThemeProvider>
        <BrowserRouter>
          <GlobalServicesProvider>
            <App />
          </GlobalServicesProvider>
        </BrowserRouter>
      </ThemeProvider>
    </SCThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
