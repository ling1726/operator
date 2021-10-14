import * as React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-make-styles";
import { Button, Input } from "@react95/core";

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

export const LaunchForm = React.memo(
  ({ onSubmit, loading = false }: LaunchFormProps) => {
    const styles = useStyles();

    const formRef = React.useRef<HTMLFormElement>(null);
    const typeRef = React.useRef<LaunchFormData["type"]>();

    const handleSubmit = React.useCallback(
      async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        const serverInput = ev.currentTarget.elements.namedItem(
          "server"
        ) as HTMLInputElement;
        const userNameInput = ev.currentTarget.elements.namedItem(
          "user-name"
        ) as HTMLInputElement;

        if (onSubmit && typeRef.current) {
          onSubmit(ev, {
            serverName: serverInput.value,
            type: typeRef.current,
          });
          formRef.current?.reset();
          typeRef.current = undefined;
        }
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
          <label htmlFor="server-input">Server</label>
          <Input
            disabled={loading}
            autoComplete="off"
            type="text"
            name="server"
            id="server-input"
            required
          />
        </span>
        <Button disabled={loading} onClick={requestJoin} type="button">
          Join
        </Button>
        <Button disabled={loading} onClick={requestHost} type="button">
          Host
        </Button>
      </form>
    );
  }
);

LaunchForm.displayName = "LaunchForm";
