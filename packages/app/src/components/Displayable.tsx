import * as React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-make-styles";

const useStyles = makeStyles({
  root: {
    height: "100px",
    width: "100px",
    border: "none",
    display: "flex",
    flexDirection: 'column',
    gap: '5px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: "pointer",
    background: "none",
  },
  checked: {
    border: '1px solid red',
  },
});

export interface DisplayableProps {
  id: number;
  displayName: string;
  checked: boolean;
  onChange(id: number): void;
  children: React.ReactNode;
}

export function Displayable(props: DisplayableProps) {
  const styles = useStyles();
  const handleClick = React.useCallback(
    () => props.onChange(props.id),
    [props.id, props.onChange]
  );
  return (
    <button
      /** this data attr handles click outside to deselect */
      data-displayable="true"
      onClick={handleClick}
      className={mergeClasses(styles.root, props.checked && styles.checked)}
    >

      {props.children}
      <h4 style={{ margin: 0}}>{props.displayName}</h4>
    </button>
  );
}
