import * as React from "react";
import {
  Button,
  makeStyles,
  mergeClasses,
  Label,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateRows: "repeat(3, 1fr)",
    gridTemplateAreas: `
      "user-name user-name"
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
  userName: {
    gridArea: "user-name",
  },
  server: {
    gridArea: "server",
  },
});

export interface LaunchFormData {
  userName: string;
  serverName: string;
  type: "join" | "host";
}

export interface LaunchFormProps {
  onSubmit?(
    ev: React.FormEvent<HTMLFormElement>,
    data: LaunchFormData
  ): void | Promise<void>;
}

export function LaunchForm(props: LaunchFormProps) {
  const styles = useStyles();
  const [loading, setLoading] = React.useState(false);

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

      if (props.onSubmit) {
        const loading = props.onSubmit(ev, {
          userName: serverInput.value,
          serverName: userNameInput.value,
          type: typeRef.current,
        });
        if (loading instanceof Promise) {
          setLoading(true);
          await loading;
          setLoading(false);
        }
      }
      formRef.current?.reset();
    },
    [props.onSubmit]
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
      <span className={mergeClasses(styles.input, styles.userName)}>
        <Label
          disabled={loading}
          size="large"
          htmlFor="user-name-input"
          required
        >
          Username
        </Label>
        <input
          disabled={loading}
          autoComplete="off"
          type="text"
          name="user-name"
          id="user-name-input"
          required
        />
      </span>
      <span className={mergeClasses(styles.input, styles.server)}>
        <Label disabled={loading} size="large" htmlFor="server-input" required>
          Server
        </Label>
        <input
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
