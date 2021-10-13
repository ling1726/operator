import { Label, Button } from "@fluentui/react-components";
import React from "react";

export interface RegisterFormData {
  username: string;
}

export interface RegisterFormProps {
  onSubmit?(ev: React.FormEvent<HTMLFormElement>, data: RegisterFormData): void;
}

export function RegisterForm(props: RegisterFormProps) {
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    const usernameInput = ev.currentTarget.elements.namedItem(
      "user-name"
    ) as HTMLInputElement;
    props.onSubmit?.(ev, { username: usernameInput.value });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Label size="large" htmlFor="user-name-input" required>
        Username
      </Label>
      <input
        autoComplete="off"
        type="text"
        name="user-name"
        id="user-name-input"
        required
      />
      <Button type="submit" appearance="primary">
        Register
      </Button>
    </form>
  );
}
