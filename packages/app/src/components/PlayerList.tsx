import { makeStyles } from "@fluentui/react-make-styles";
import { Frame, TitleBar, Fieldset, Checkbox } from "@react95/core";
import { Awschd32402 } from "@react95/icons";
import { memo } from "react";
import { Player } from "../api";

export interface PlayerListProps {
  players: Player[];
}

const useStyles = makeStyles({
  set: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
});

export const PlayerList = memo(({ players }: PlayerListProps) => {
  const styles = useStyles();
  return (
    <Fieldset className={styles.set} legend="Players">
      {players.map((player) => (
        <label className={styles.label} key={player.id}>
          {player.displayName}
          <Checkbox disabled title="ready" checked={player.ready} />
        </label>
      ))}
    </Fieldset>
  );
});
