import type { ReactNode, ButtonHTMLAttributes } from "react";

export type LayoutProps = { children: ReactNode };

export type HeaderProps = {
  title: string;
  subtitle?: string;
};

export type CardProps = { children: ReactNode };

export type RowProps = { label: string; value: string };

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type MyPageViewProps = {
  title: string;
  subtitle?: string;

  shopNameText: string;
  positionLabel: string;
  roleLabel: string;

  canInvite: boolean;
  inviteOpen: boolean;
  onToggleInviteOpen: () => void;

  logoutAction: () => Promise<void>;

  accountOpen: boolean;
  onToggleAccountOpen: () => void;

  deleteConfirmText: string;
  onChangeDeleteConfirmText: (v: string) => void;
  canSubmitDelete: boolean;

  deletingAccount: boolean;
  deleteAccountError?: string;
  onDeleteAccount: () => Promise<void>;
};
