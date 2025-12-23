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

  emailLocked?: boolean; // true면 이메일 입력 수정 불가(readOnly/disabled)
  hideShopName?: boolean; // true면 shopName 입력 숨김
  disableModeToggle?: boolean; // true면 모드 토글 버튼 숨김(또는 비활성)
};
