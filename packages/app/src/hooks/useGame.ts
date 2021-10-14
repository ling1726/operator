import { useSelector } from "@xstate/react";
import * as React from "react";
import { useGlobalServices } from "../components/GlobalServicesProvider";
import { gameSelectors } from "../machines/game";

export function useGame() {
  const { gameService } = useGlobalServices();
  const exchanges = useSelector(gameService, gameSelectors.exchanges);
  const attendees = useSelector(gameService, gameSelectors.attendees);
  const score = useSelector(gameService, gameSelectors.score);
  const mission = useSelector(gameService, gameSelectors.mission);
  const isGameOver = useSelector(gameService, gameSelectors.isGameOver);
  const [selectedExchange, setSelectedExchange] = React.useState<
    number | undefined
  >();
  const [selectedAttendant, setSelectedAttendant] = React.useState<
    number | undefined
  >();

  React.useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-displayable="true"]')) {
        setSelectedExchange(undefined);
        setSelectedAttendant(undefined);
      }
    };

    document.addEventListener("click", listener);

    return () => document.removeEventListener("click", listener);
  }, [setSelectedExchange, setSelectedAttendant]);

  React.useEffect(() => {
    if (selectedExchange && selectedAttendant) {
      console.log(gameService.state.context.socketRef.getSnapshot());
      console.log(gameService.state.value);
      gameService.send({
        type: "Connect",
        payload: { exchange: selectedExchange, attendee: selectedAttendant },
      });
      setSelectedAttendant(undefined);
      setSelectedExchange(undefined);
    }
  }, [selectedExchange, selectedAttendant]);
  return {
    exchanges,
    attendees,
    score,
    mission,
    isGameOver,
    selectedExchange,
    setSelectedExchange,
    selectedAttendant,
    setSelectedAttendant,
  } as const;
}
