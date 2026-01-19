import type { ReactNode } from "react";

export type FindEmailPageViewProps = {
  title: string;
  subtitle?: string;
  hint?: string;

  email: string;
  onChangeEmail: (v: string) => void;

  loading: boolean;
  error?: string;
  doneMessage?: string;

  canSubmit: boolean;
  onSubmit: () => void;

  onBackToLogin: () => void;
  onGoPasswordReset: () => void;
};

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
};

export type MessageProps = { children: ReactNode };

export type ActionButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};
