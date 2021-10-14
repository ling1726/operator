import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

  @font-face { 
  font-family: "ms_sans_serif";
  /* Add other properties here, as needed. For example: */
  /*
  font-weight: normal;
  font-style: normal;
  */
  src: url(data:application/octet-stream;base64,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);
}

  body {
    font-family: 'ms_sans_serif';
    background-color: teal;
  }
`;
