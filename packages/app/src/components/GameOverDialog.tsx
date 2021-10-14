import { makeStyles, mergeClasses } from "@fluentui/react-make-styles";
import { memo } from "react";
import { Button, Frame, TitleBar } from "@react95/core";
import { User4 } from "@react95/icons";

const useStyles = makeStyles({
  article: {
    padding: "20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },

  frame: {
    width: "100%",
  },
  dialog: {
    margin: "0",
    padding: "0",
    display: "flex",
    width: "300px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  dialogClose: {
    display: "none",
  },
});

export type GameOverDialogProps = JSX.IntrinsicElements["dialog"] & {
  startTimestamp: number;
  endTimestamp: number;
  onPlayAgain?(): void;
};

export const GameOverDialog = memo(
  ({
    className,
    startTimestamp = 0,
    endTimestamp = 0,
    onPlayAgain,
    open,
    ...props
  }: GameOverDialogProps) => {
    const styles = useStyles();
    return (
      <dialog
        open={open}
        {...props}
        className={mergeClasses(
          className,
          styles.dialog,
          !open && styles.dialogClose
        )}
      >
        <Frame className={styles.frame}>
          <TitleBar active icon={<User4 variant="32x32_4" />} title="Game Over">
            <TitleBar.OptionsBox>
              <TitleBar.Option>?</TitleBar.Option>
              <TitleBar.Option>X</TitleBar.Option>
            </TitleBar.OptionsBox>
          </TitleBar>
          <article className={styles.article}>
            <p>
              {"You've completed the game "}
              {rtf.format((endTimestamp - startTimestamp) / 1000, "second")}
            </p>
            <Button onClick={onPlayAgain}>Play Again</Button>
          </article>
        </Frame>
      </dialog>
    );
  }
);

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
