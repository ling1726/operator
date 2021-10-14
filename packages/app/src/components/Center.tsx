import { makeStyles, mergeClasses } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export function Center(props: JSX.IntrinsicElements["main"]) {
  const styles = useStyles();
  return (
    <main
      {...props}
      className={mergeClasses(styles.container, props.className)}
    />
  );
}
