import * as React from "react";
import { Button, makeStyles, mergeClasses } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    gridTemplateAreas: `
      "user-name user-name"
      "server    server"
      "submit1   submit2"
    `,
    gap: "1rem",
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
  submit1: {
    gridArea: "submit1",
  },
  submit2: {
    gridArea: "submit2",
  },
});

export interface LaunchFormData {
  userName: string;
  serverName: string;
  type: "join" | "host";
}

export interface LaunchFormProps {
  onSubmit?(ev: React.FormEvent<HTMLFormElement>, data: LaunchFormData): void;
}

export function LaunchForm(props: LaunchFormProps) {
  const styles = useStyles();

  const handleSubmit = React.useCallback(
    (ev: React.FormEvent<HTMLFormElement>) => {
      const data: LaunchFormData = {
        userName: "",
        serverName: "",
        type: "host",
      };
      console.log(ev.currentTarget, ev.target);
      props.onSubmit?.(ev, data);
    },
    [props.onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.root}>
      <label className={mergeClasses(styles.userName, styles.input)}>
        username:
        <input
          autoComplete="off"
          type="text"
          name="userName"
          id="user-name-input"
          required
        />
      </label>
      <label className={mergeClasses(styles.server, styles.input)}>
        server:
        <input
          autoComplete="off"
          type="text"
          name="server"
          id="server-input"
          required
        />
      </label>
      <Button className={styles.submit1} type="submit" appearance="primary">
        Join
      </Button>
      <Button className={styles.submit2} type="submit" appearance="outline">
        Host
      </Button>
    </form>
  );
}
