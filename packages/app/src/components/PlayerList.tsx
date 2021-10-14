import { makeStyles } from "@fluentui/react-make-styles";
import { Fieldset, Checkbox, Button } from "@react95/core";
import { memo } from "react";
import { Player } from "../api";

export interface PlayerListProps {
  players: Player[];
  readyButtonDisabled: boolean;
  onClickReadyButton: () => void;
}

const useStyles = makeStyles({
  set: {
    display: "flex",
    minHeight: "300px",
    flexDirection: "column",
    padding: "20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  playerName: {
    minWidth: "8rem",
  },

  readyButton: {
    marginTop: 'auto',
  }
});

export const PlayerList = memo(
  ({ players, readyButtonDisabled, onClickReadyButton }: PlayerListProps) => {
    const styles = useStyles();
    return (
      <Fieldset className={styles.set} legend="Players">
        {players.map((player) => (
          <label className={styles.label} key={player.id}>
            <span className={styles.playerName}>{player.displayName}</span>
            <Checkbox disabled title="ready" checked={player.ready} />
          </label>
        ))}
        <Button className={styles.readyButton} disabled={readyButtonDisabled} onClick={onClickReadyButton}>
          Ready
        </Button>
      </Fieldset>
    );
  }
);

PlayerList.displayName = "PlayerList";
