import { Progress } from "react95";
import { makeStyles } from "@fluentui/react-make-styles";
import { memo } from "react";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: 'column',
    gap: '10px',
    marginTop: "auto",
    marginBottom: "15px",
    '& h2': {
      margin: 0,
    }
  },
});

export interface ScoreBarProps {
  score: number;
}

export const ScoreBar = memo((props: ScoreBarProps) => {
  const { score } = props;
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <h2>QoS</h2>
      <Progress value={score} variant="tile" />
    </div>
  );
});

ScoreBar.displayName = "ScoreBar";
