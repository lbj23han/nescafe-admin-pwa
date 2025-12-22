"use client";

import { LoginUI } from "./LoginUI";
import type { LayoutProps, MainProps, FooterProps } from "./LoginPage.types";

type AuthFormProps = Parameters<typeof LoginUI.AuthForm>[0];

export const LoginPageUI = {
  Layout({ children }: LayoutProps) {
    return <LoginUI.Layout>{children}</LoginUI.Layout>;
  },

  Main({ children }: MainProps) {
    return <LoginUI.Main>{children}</LoginUI.Main>;
  },

  Footer({ year, appName }: FooterProps) {
    return <LoginUI.Footer year={year} appName={appName} />;
  },

  AuthForm(props: AuthFormProps) {
    return <LoginUI.AuthForm {...props} />;
  },
};
