"use client";

import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import type {
  LayoutProps,
  MainProps,
  FooterProps,
  AuthFormProps,
} from "./LoginPage.types";
import { AuthForm } from "./AuthForm/AuthForm";

export const LoginPageUI = {
  Layout({ children }: LayoutProps) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-6">
        {children}
      </div>
    );
  },

  Main({ children }: MainProps) {
    return <main className="w-full max-w-xs mb-8">{children}</main>;
  },

  Footer({ year, appName }: FooterProps) {
    return (
      <footer className="text-[11px] text-zinc-400">
        © {year} {appName}. All rights reserved.
      </footer>
    );
  },

  AuthForm(props: AuthFormProps) {
    return <AuthForm {...props} copy={LOGIN_PAGE_COPY} />;
  },
};
