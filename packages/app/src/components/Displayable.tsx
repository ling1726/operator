import * as React from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-make-styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

const useStyles = makeStyles({
  root: {
    height: "100px",
    width: "100px",
    border: "2px black solid",
    display: "flex",
    cursor: "pointer",
  },
  checked: {
    borderColor: "red",
  },
});

export interface DisplayableProps {
  id: number;
  displayName: string;
  checked: boolean;
  icon: IconDefinition;
  onChange(id: number): void;
}

export function Displayable(props: DisplayableProps) {
  const styles = useStyles();
  const handleClick = React.useCallback(
    () => props.onChange(props.id),
    [props.id, props.onChange]
  );
  return (
    <button
      onClick={handleClick}
      className={mergeClasses(styles.root, props.checked && styles.checked)}
    >
      {props.displayName}
      <FontAwesomeIcon icon={props.icon} />
    </button>
  );
}
