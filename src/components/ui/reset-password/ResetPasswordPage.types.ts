import type { ReactNode } from "react";

/* =========================
 * View Props
 * ========================= */
export type ResetPasswordPageViewProps = {
  title: string;
  subtitle?: string;

  password: string;
  confirmPassword: string;
  onChangePassword: (v: string) => void;
  onChangeConfirmPassword: (v: string) => void;

  loading: boolean;
  error?: string;
  doneMessage?: string;

  passwordPolicyErrors?: string[];
  passwordPolicyValid?: boolean;

  canSubmit: boolean;
  onSubmit: () => void;
  onBackToLogin: () => void;
};

/* =========================
 * UI Props
 * ========================= */
export type LayoutProps = { children: ReactNode };

export type HeaderProps = {
  title: string;
  subtitle?: string;
};

export type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export type MessageProps = {
  children: ReactNode;
};

export type ActionButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export type SecondaryButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};
