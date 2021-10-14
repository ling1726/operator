import * as React from "react";
import { Card } from "@fluentui/react-components/unstable";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { makeStyles, mergeClasses, Title1, Headline } from "@fluentui/react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone } from "@fortawesome/free-solid-svg-icons"
import { ProgressBar, Fieldset } from '@react95/core';
import { Awschd32402, User } from "@react95/icons";

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
    <Fieldset>
      <CountdownCircle duration={duration} onTimeout={onMissionTimeout} />
      <div>
        <Title1>{name}</Title1>
        <div className={styles.row}> <User variant="32x32_4" /> <Headline>{caller}</Headline></div>
        <div className={styles.row}> <User variant="32x32_4" /> <Headline>{callee}</Headline></div>
        <div className={styles.row}> <Awschd32402 variant="32x32_4" /> <Headline>{exchange}</Headline></div>
      </div>
    </Fieldset>
  );
}

function CountdownCircle(props: CountDownCircleProps) {
  const { duration, onTimeout } = props;
  const [progress, setProgress] = React.useState(100);
  const progressRef = React.useRef(() => {});
  const tickProgress = React.useMemo(
    () => Math.round((tickDuration / duration) * 100),
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

  return <ProgressBar percent={progress} width={100} />;
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
