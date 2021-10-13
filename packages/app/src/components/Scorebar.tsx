import LinearProgress, { linearProgressClasses }  from "@mui/material/LinearProgress";
import { makeStyles, mergeClasses } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    marginTop: "5px",
    marginBotton: "5px",
    paddingLeft: '5px',
    paddingRight: '5px',

    [`& .${linearProgressClasses.root}`]: {
      height: '30px',
      borderRadius: '5px'
    }
  },

  safe: {
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: 'green',
    }
  },

  warning: {
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: 'orange',
    }
  },

  danger: {
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: 'red',
    }
  }
});

export function Scorebar(props: ScorebarProps) {
  const styles = useStyles();
  const { score } = props;

  let barColour = styles.safe;
  if (score < 60) {
    barColour = styles.warning;
  }

  if (score < 30) {
    barColour = styles.danger;
  }

  return (
    <div className={mergeClasses(styles.root, barColour)}>
      <LinearProgress variant="determinate" value={score} />
    </div>
  );
}

export interface ScorebarProps {
  score: number;
}
