import * as React from "react";
import { makeStyles } from "@fluentui/react-make-styles";
import { Awschd32402, User } from "@react95/icons";
import { Fieldset } from "@react95/core";
import { Progress } from "react95";
import { Avatar } from "react95";

const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: "30px",
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  title: {
    display: "flex",
    alignItems: "center",
  },
});

const tickProgress = 0.05;

export interface MissionProps {
  name: string;
  caller: string;
  callerId: number;
  callee: string;
  exchange: string;
  duration: number;
  onMissionTimeout: () => void;
  id: number;
}

export const Mission = React.memo((props: MissionProps) => {
  const { name, caller, callee, exchange, duration, onMissionTimeout, callerId, id } = props;
  const styles = useStyles();

  return (
    <Fieldset style={{ width: 300, display: 'flex', flexDirection: 'column' }}>
      <div>
        <h2>{id == -1 ? 'Get ready' : name}</h2>
        <div className={styles.row}>
          {" "}
          <Avatar src={`https://avatars.dicebear.com/api/pixel-art/${callerId}.svg`} /> <h4>{caller}</h4>
        </div>
        <div className={styles.row}>
          {" "}
          <User variant="32x32_4" /> <h4>{callee}</h4>
        </div>
        <div className={styles.row}>
          {" "}
          <Awschd32402 variant="32x32_4" /> <h4>{exchange}</h4>
        </div>
      </div>
      <CountdownCircle duration={duration} onTimeout={onMissionTimeout} />
    </Fieldset>
  );
});

Mission.displayName = "Mission";

interface CountDownCircleProps {
  duration: number;
  onTimeout?: () => void;
}

const CountdownCircle = React.memo((props: CountDownCircleProps) => {
  const { duration, onTimeout } = props;
  const [progress, setProgress] = React.useState(100);
  const progressRef = React.useRef(() => {});
  const tickDuration = React.useMemo(() => Math.floor(0.05*duration), [duration]);

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
          onTimeout?.();
          return 0;
        }

        return progress - (tickProgress*100);
      });
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(progressRef.current, tickDuration);

    return () => clearInterval(timer);
  }, []);

  return <Progress style={{marginTop: 'auto'}} value={progress} hideValue />;
});

CountdownCircle.displayName = "CountdownCircle";
