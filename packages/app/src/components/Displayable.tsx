import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { makeStyles, mergeClasses, Headline } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    height: "100px",
    width: "100px",
    border: "none",
    display: "flex",
    flexDirection: 'column',
    gap: '5px',
    alignItems: 'center',
    cursor: "pointer",
    background: "none",
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
      <FontAwesomeIcon icon={props.icon} size="4x" />
      <Headline>{props.displayName}</Headline>
    </button>
  );
}
