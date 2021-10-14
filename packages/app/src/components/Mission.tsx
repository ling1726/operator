import * as React from "react";
import { makeStyles } from "@fluentui/react-make-styles";
import { Awschd32402, User } from "@react95/icons";
import { Fieldset } from '@react95/core';
// @ts-ignore
import { Progress } from "react95";

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
});

const tickDuration = 100;

export function Mission(props: MissionProps) {
  const { name, caller, callee, exchange, duration, onMissionTimeout } = props;
  const styles = useStyles();

  return (
    <Fieldset>
      <div>
        <h2>{name}</h2>
        <div className={styles.row}> <User variant="32x32_4" /> <h4>{caller}</h4></div>
        <div className={styles.row}> <User variant="32x32_4" /> <h4>{callee}</h4></div>
        <div className={styles.row}> <Awschd32402 variant="32x32_4" /> <h4>{exchange}</h4></div>
      </div>
      <CountdownCircle duration={duration} onTimeout={onMissionTimeout} />
    </Fieldset>
  );
}

function CountdownCircle(props: CountDownCircleProps) {
  const { duration, onTimeout } = props;
  const [progress, setProgress] = React.useState(100);
  const progressRef = React.useRef(() => {});
  const tickProgress = React.useMemo(
    () => Math.floor((tickDuration / duration) * 100),
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

  return <Progress value={progress} hideValue />;
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
