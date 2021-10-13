import * as React from "react";
import { Card } from "@fluentui/react-components/unstable";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { makeStyles, mergeClasses, Title1, Headline } from "@fluentui/react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone } from "@fortawesome/free-solid-svg-icons"

const useStyles = makeStyles({
  root: {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    gap: '30px',
  },

  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  title: {
    display: 'flex',
    alignItems: 'center',
  },

  safe: {
    [`& .${circularProgressClasses.svg}`]: {
      color: "green",
    },
  },

  warning: {
    [`& .${circularProgressClasses.svg}`]: {
      color: "orange",
    },
  },

  danger: {
    [`& .${circularProgressClasses.svg}`]: {
      color: "red",
    },
  },
});

const tickDuration = 100;

export function Mission(props: MissionProps) {
  const { name, caller, callee, exchange, duration, onMissionTimeout } = props;
  const styles = useStyles();

  return (
    <Card className={mergeClasses(styles.root)}>
      <div className={styles.title}>
        <CountdownCircle duration={duration} onTimeout={onMissionTimeout} />
      </div>
      <div>
        <Title1>{name}</Title1>
        <div className={styles.row}> <FontAwesomeIcon icon={faUser} /> <Headline>{caller}</Headline></div>
        <div className={styles.row}> <FontAwesomeIcon icon={faUser} /> <Headline>{callee}</Headline></div>
        <div className={styles.row}> <FontAwesomeIcon icon={faPhone} /> <Headline>{exchange}</Headline></div>
      </div>
    </Card>
  );
}

function CountdownCircle(props: CountDownCircleProps) {
  const { duration, onTimeout } = props;
  const [progress, setProgress] = React.useState(100);
  const progressRef = React.useRef(() => {});
  const tickProgress = React.useMemo(
    () => (tickDuration / duration) * 100,
    [tickDuration, duration]
  );

  React.useEffect(() => {
    progressRef.current = () => {
      setProgress((progress) => {
        // const nextProgress = progress - tickProgress;
        // TODO remove this when hooked up to BE
        // if (nextProgress < 0) {
        //   onTimeout();
        //   return 100;
        // }
        // return nextProgres;

        if (progress <= 0) {
          onTimeout();
          return 0;
        }

        return progress - tickProgress;
      });
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(progressRef.current, tickDuration);

    return () => clearInterval(timer);
  }, []);

  const styles = useStyles();

  let barColour = styles.safe;
  if (progress < 60) {
    barColour = styles.warning;
  }

  if (progress < 30) {
    barColour = styles.danger;
  }

  return <CircularProgress style={{width: 100, height: 100}} className={mergeClasses(barColour)} variant="determinate" value={progress} />;
}

interface CountDownCircleProps {
  duration: number;
  onTimeout: () => void;
}

export interface MissionProps {
  name: string;
  caller: string;
  callee: string;
  exchange: string;
  duration: number;
  onMissionTimeout: () => void;
}
