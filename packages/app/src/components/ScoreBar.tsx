import { Progress } from "react95";
import { makeStyles } from "@fluentui/react-make-styles";
import { memo } from "react";

const useStyles = makeStyles({
  container: {
    display: "flex",
    marginTop: "auto",
    marginBottom: "15px",
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
      <Progress value={score} variant="tile" />
    </div>
  );
});

ScoreBar.displayName = "ScoreBar";
