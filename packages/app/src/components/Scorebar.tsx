// @ts-ignore
import { Progress } from "react95";
import { makeStyles } from '@fluentui/react-make-styles';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    marginTop: 'auto',
    marginBottom: '15px',
  }
})

export function Scorebar(props: ScorebarProps) {
  const { score } = props;
  const styles = useStyles();

  return (
    <div className={styles.container}>
        {/** @ts-ignore */}
        <Progress value={score} variant="tile" />
    </div>
  );
}

export interface ScorebarProps {
  score: number;
}
