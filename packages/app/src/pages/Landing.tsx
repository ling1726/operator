import { LaunchForm } from "../components/LaunchForm";
import { Center } from "../components/Center";
import { Redirect } from "react-router";
import { makeStyles } from "@fluentui/react-components";
import { memo } from "react";
import { useLanding } from "../hooks/useLanding";
import { Frame, TitleBar } from "@react95/core";
import { Awschd32402 } from "@react95/icons";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2rem",
    maxWidth: "350px",
    margin: "auto",
  },
  title: (theme) => ({
    fontFamily: theme.fontFamilyBase,
    fontSize: theme.fontSizeHero1000,
    fontWeight: theme.fontWeightSemibold,
  }),
  paragraph: (theme) => ({
    textAlign: "justify",
    textJustify: "inter-word",
    fontFamily: theme.fontFamilyMonospace,
    fontSize: theme.fontSizeBase400,
    fontWeight: theme.fontWeightMedium,
  }),
});

export const Landing = memo(() => {
  const styles = useStyles();
  const { redirect, loading, onSubmit } = useLanding();
  if (redirect) return <Redirect to="/lobby" />;
  return (
    <Center>
      <Frame>
        <TitleBar
          active
          icon={<Awschd32402 variant="32x32_4" />}
          title="Operator"
          className="draggable"
        >
          <TitleBar.OptionsBox>
            <TitleBar.Option>?</TitleBar.Option>
            <TitleBar.Option>X</TitleBar.Option>
          </TitleBar.OptionsBox>
        </TitleBar>
        <article className={styles.root}>
          <h1 className={styles.title}>Operator</h1>
          <p className={styles.paragraph}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quasi
            in rerum neque ut optio voluptates inventore quaerat nulla odio
            consectetur corporis voluptatum hic, at, cum ab ducimus fugit illo?
          </p>
          <LaunchForm loading={loading} onSubmit={onSubmit} />
        </article>
      </Frame>
    </Center>
  );
});
