import type { ReactNode, ButtonHTMLAttributes } from "react";

export type LayoutProps = { children: ReactNode };

export type HeaderProps = {
  title: string;
  subtitle?: string;
};

export type CardProps = { children: ReactNode };

export type RowProps = { label: string; value: string };

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type MyPageShopEditProps = {
  shopName: string;
  onChangeShopName: (v: string) => void;
  onSaveShopName: () => Promise<void>;
  savingShopName: boolean;
  saveShopNameError?: string;
  canSaveShopName: boolean;
};

export type MyPageViewProps = {
  title: string;
  subtitle?: string;

  shopNameText: string;
  positionLabel: string;
  roleLabel: string;

  canInvite: boolean;
  inviteOpen: boolean;
  onToggleInviteOpen: () => void;

  onLogout: () => Promise<void>;

  // profile (display name)
  displayName: string;
  onChangeDisplayName: (v: string) => void;
  onSaveDisplayName: () => Promise<void>;
  savingName: boolean;
  saveNameError?: string;
  canSaveName: boolean;

  // delete account
  accountOpen: boolean;
  onToggleAccountOpen: () => void;

  deleteConfirmText: string;
  onChangeDeleteConfirmText: (v: string) => void;
  canSubmitDelete: boolean;

  deletingAccount: boolean;
  deleteAccountError?: string;
  onDeleteAccount: () => Promise<void>;

  shopEdit?: MyPageShopEditProps;
};
