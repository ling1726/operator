import * as React from "react";
import {
  makeStyles,
  mergeClasses,
  Label,
} from "@fluentui/react-components";
import { Button, Input } from '@react95/core';

const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateRows: "repeat(2, 1fr)",
    gridTemplateAreas: `
      "server    server"
      "......    ......"
    `,
    gap: "1rem",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    display: "flex",
    flexDirection: "column",
  },
  server: {
    gridArea: "server",
  },
});

export interface LaunchFormData {
  serverName: string;
  type: "join" | "host";
}

export interface LaunchFormProps {
  onSubmit?(ev: React.FormEvent<HTMLFormElement>, data: LaunchFormData): void;
  loading?: boolean;
}

export function LaunchForm({ onSubmit, loading = false }: LaunchFormProps) {
  const styles = useStyles();

  const formRef = React.useRef<HTMLFormElement>(null);
  const typeRef = React.useRef<LaunchFormData["type"]>("host");

  const handleSubmit = React.useCallback(
    async (ev: React.FormEvent<HTMLFormElement>) => {
      const serverInput = ev.currentTarget.elements.namedItem(
        "server"
      ) as HTMLInputElement;
      const userNameInput = ev.currentTarget.elements.namedItem(
        "user-name"
      ) as HTMLInputElement;

      if (onSubmit) {
        onSubmit(ev, {
          serverName: serverInput.value,
          type: typeRef.current,
        });
      }
      formRef.current?.reset();
    },
    [onSubmit]
  );

  const requestJoin = React.useCallback(() => {
    typeRef.current = "join";
    formRef.current?.requestSubmit();
  }, []);
  const requestHost = React.useCallback(() => {
    typeRef.current = "host";
    formRef.current?.requestSubmit();
  }, []);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.root}>
      <span className={mergeClasses(styles.input, styles.server)}>
        <Label disabled={loading} size="large" htmlFor="server-input" required>
          Server
        </Label>
        <Input
          disabled={loading}
          autoComplete="off"
          type="text"
          name="server"
          id="server-input"
          required
        />
      </span>
      <Button
        disabled={loading}
        onClick={requestJoin}
        type="button"
        appearance="primary"
      >
        Join
      </Button>
      <Button
        disabled={loading}
        onClick={requestHost}
        type="button"
        appearance="outline"
      >
        Host
      </Button>
    </form>
  );
}
