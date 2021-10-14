import { makeStyles, mergeClasses } from "@fluentui/react-make-styles";
import { Button, Input, Frame, TitleBar } from "@react95/core";
import { Awschd32402 } from "@react95/icons";
import { memo, useCallback } from "react";

export interface RegisterFormData {
  username: string;
}

export type RegisterFormProps = Omit<
  JSX.IntrinsicElements["form"],
  "onSubmit"
> & {
  onSubmit?(ev: React.FormEvent<HTMLFormElement>, data: RegisterFormData): void;
};

const useStyles = makeStyles({
  fieldSet: {
    display: "flex",
    flexDirection: "column",
  },
  form: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    alignItems: "flex-end",
  },
});

export const RegisterForm = memo(
  ({ onSubmit, className, ...rest }: RegisterFormProps) => {
    const handleSubmit = useCallback(
      (ev: React.FormEvent<HTMLFormElement>) => {
        const usernameInput = ev.currentTarget.elements.namedItem(
          "user-name"
        ) as HTMLInputElement;
        onSubmit?.(ev, { username: usernameInput.value });
      },
      [onSubmit]
    );
    const styles = useStyles();
    return (
      <Frame>
        <TitleBar
          active
          icon={<Awschd32402 variant="32x32_4" />}
          title="Register"
        >
          <TitleBar.OptionsBox>
            <TitleBar.Option>?</TitleBar.Option>
            <TitleBar.Option>X</TitleBar.Option>
          </TitleBar.OptionsBox>
        </TitleBar>
        <form
          {...rest}
          onSubmit={handleSubmit}
          className={mergeClasses(className, styles.form)}
        >
          <span className={styles.fieldSet}>
            <label htmlFor="user-name-input">Username</label>
            <Input
              autoComplete="off"
              type="text"
              name="user-name"
              id="user-name-input"
              required
            />
          </span>
          <Button type="submit">Register</Button>
        </form>
      </Frame>
    );
  }
);

RegisterForm.displayName = "RegisterForm";
