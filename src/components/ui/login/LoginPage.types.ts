import type { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export type MainProps = {
  children: ReactNode;
};

export type FooterProps = {
  year: number;
  appName: string;
};

export type AuthFormMode = "login" | "signup";

export type AuthFormProps = {
  mode: AuthFormMode;
  email: string;
  password: string;
  confirmPassword: string;
  shopName: string;

  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeConfirmPassword: (v: string) => void;
  onChangeShopName: (v: string) => void;

  onSubmit: () => void;
  onToggleMode: () => void;

  loading?: boolean;
  error?: string;
  successMessage?: string;
};
