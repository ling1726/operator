/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_WS_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "react95" {
  import * as React from "react";
  export const Avatar: React.ElementType<any>;
  export const Progress: React.ElementType<any>;
  export const Divider: React.ElementType<any>;
}

declare module "react95/dist/themes/original" {
  const theme: any;
  export default theme;
}
