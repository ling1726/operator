import { Progress } from "react95";
// pick a theme of your choice
import original from "react95/dist/themes/original";

export function Scorebar(props: ScorebarProps) {
  const { score } = props;

  return (
    <div>
        {/** @ts-ignore */}
        <Progress value={score} />
    </div>
  );
}

export interface ScorebarProps {
  score: number;
}
