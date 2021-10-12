import * as React from "react";
import { Response, Request } from "../api";

function noop() {
  /* noop */
}

export type WebSocketContextValue = [
  WebSocket | undefined,
  React.Dispatch<React.SetStateAction<WebSocket | undefined>>
];

export const WebSocketState = [
  "CONNECTING",
  "OPEN",
  "CLOSING",
  "CLOSED",
] as const;

const context = React.createContext<WebSocketContextValue>([undefined, noop]);

export interface WebSocketProviderProps {
  url?: string;
  children?: React.ReactNode;
}

export function WebSocketProvider(props: WebSocketProviderProps) {
  const state = React.useState(() =>
    props.url ? new WebSocket(props.url) : undefined
  );
  return <context.Provider value={state}>{props.children}</context.Provider>;
}

export function useCreateWebSocket() {
  const [ws, setWS] = React.useContext(context);
  return React.useCallback(
    async (url: string) => {
      setWS(new WebSocket(url));
      ws?.close();
    },
    [ws, setWS]
  );
}

export function useWebSocket() {
  const [ws] = React.useContext(context);
  const send = React.useCallback(
    (message: Request) => ws?.send(JSON.stringify(message)),
    []
  );
  const [latestMessage, setLatestMessage] = React.useState<Response>();
  const [state, setState] = React.useState<typeof WebSocketState[number]>(
    WebSocketState[ws?.readyState ?? 0]
  );
  React.useEffect(() => {
    const listener = ({ data }: MessageEvent<string>) =>
      setLatestMessage(JSON.parse(data));
    ws?.addEventListener("message", listener);
    ws?.addEventListener("open", () => setState(WebSocketState[ws.readyState]));
    return () => ws?.removeEventListener("message", listener);
  }, [ws]);
  return [latestMessage, { state, send, ws }] as const;
}
