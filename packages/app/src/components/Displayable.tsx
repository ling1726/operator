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
    border: '1px solid red',
  },
});

export interface DisplayableProps {
  id: number;
  displayName: string;
  checked: boolean;
  icon: IconDefinition;
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
      <Headline>{props.displayName}</Headline>
    </button>
  );
}
