import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { LaunchForm } from "../components/LaunchForm";

const useStyles = makeStyles({
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export function Landing() {
  const styles = useStyles();

  const handleSubmit = React.useCallback(
    (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
    },
    []
  );

  return (
    <main className={styles.container}>
      <LaunchForm onSubmit={handleSubmit} />
    </main>
  );
}
