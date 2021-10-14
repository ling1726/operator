import "normalize.css";
import "@react95/icons/icons.css";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./pages/App";
import { BrowserRouter } from "react-router-dom";
import { GlobalServicesProvider } from "./machines/GlobalServicesProvider";
import { ThemeProvider } from "@react95/core";
import { ThemeProvider as SCThemeProvider, createGlobalStyle } from "styled-components";

// pick a theme of your choice
// @ts-ignore
import original from "react95/dist/themes/original";
// original Windows95 font (optionally)
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
    --fontFamilyMonospace: 'ms_sans_serif';
    background-color: rgb(85, 170, 170);
  }
`;

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
