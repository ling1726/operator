import * as React from "react";
import { LaunchForm, LaunchFormData } from "../components/LaunchForm";
import { Center } from "../components/Center";
import { useCreateWebSocket, useWebSocket } from "../hooks/useWebSocket";

export function Landing() {
  const createWS = useCreateWebSocket();
  const [, { state, send }] = useWebSocket();

  const [data, setData] = React.useState<LaunchFormData>();

  React.useEffect(() => {
    if (state === "OPEN" && data) {
      send({ type: "REGISTER", payload: data });
    }
  }, [state, data]);

  const handleSubmit = React.useCallback(
    async (ev: React.FormEvent<HTMLFormElement>, data: LaunchFormData) => {
      ev.preventDefault();
      const url = await new Promise<string>((res) =>
        setTimeout(() => res("ws://localhost:8080"), 3000)
      );
      createWS(url);
      setData(data);
    },
    []
  );

  return (
    <Center>
      <LaunchForm onSubmit={handleSubmit} />
    </Center>
  );
}
