import { makeStyles, mergeClasses } from "@fluentui/react-make-styles";
import { memo } from "react";

const useStyles = makeStyles({
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export type CenterProps = JSX.IntrinsicElements["main"];

export const Center = memo((props: CenterProps) => {
  const styles = useStyles();
  return (
    <main
      {...props}
      className={mergeClasses(styles.container, props.className)}
    />
  );
});

Center.displayName = "Center";
