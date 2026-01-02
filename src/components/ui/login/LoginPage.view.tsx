"use client";

import { Logo } from "@/components/Logo";
import { LoginPageUI as UI } from "@/components/ui/login/LoginPageUI";
import type { AuthFormProps, FooterProps } from "./LoginPage.types";

type Props = FooterProps & AuthFormProps;

export function LoginPageView({ year, appName, ...formProps }: Props) {
  return (
    <UI.Layout>
      <UI.Main>
        <Logo />

        <UI.AuthForm {...formProps} />
      </UI.Main>

      <UI.Footer year={year} appName={appName} />
    </UI.Layout>
  );
}
