"use client";

import type {
  LayoutProps,
  HeaderProps,
  CardProps,
  RowProps,
  ButtonProps,
} from "./MyPage.types";

type AccountPanelProps = {
  title: string;
  bullets: readonly string[];
  warningTitle: string;
  confirmHintPrefix: string;
  confirmKeyword: string;
  confirmHintSuffix: string;

  deleteConfirmText: string;
  onChangeDeleteConfirmText: (v: string) => void;

  deletingAccount: boolean;
  canSubmitDelete: boolean;
  deleteAccountLabel: string;
  deletingAccountLabel: string;

  deleteAccountError?: string;
  onDeleteAccount: () => void;
};

export const MyPageUI = {
  Layout({ children }: LayoutProps) {
    return <div className="min-h-screen bg-zinc-50 px-4 py-5">{children}</div>;
  },

  Header({ title, subtitle }: HeaderProps) {
    return (
      <header className="mb-4">
        <h1 className="text-lg font-semibold tracking-tight text-black">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
        ) : null}
      </header>
    );
  },

  Card({ children }: CardProps) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        {children}
      </section>
    );
  },

  Row({ label, value }: RowProps) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-zinc-600">{label}</span>
        <span className="max-w-[60%] truncate text-right text-sm font-medium text-black">
          {value}
        </span>
      </div>
    );
  },

  Spacer() {
    return <div className="h-4" />;
  },

  DangerButton(props: ButtonProps) {
    return (
      <button
        {...props}
        className={[
          "w-full rounded-xl px-4 py-3 text-sm font-semibold",
          "bg-zinc-900 text-white active:opacity-90",
          "disabled:opacity-50",
          props.className ?? "",
        ].join(" ")}
      />
    );
  },

  SectionCard({ children }: { children: React.ReactNode }) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        {children}
      </div>
    );
  },

  BulletList({ items }: { items: readonly string[] }) {
    return (
      <ul className="mt-2 list-disc pl-5 text-xs text-zinc-600 space-y-1">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    );
  },

  AccountPanel(props: AccountPanelProps) {
    const keywordOk = props.deleteConfirmText === props.confirmKeyword;

    const inputClass = [
      "mt-3 w-full rounded-xl border px-3 py-2 text-sm",
      "bg-white focus:outline-none focus:ring-2",
      keywordOk
        ? "border-red-500 text-zinc-900 focus:ring-red-300"
        : "border-red-200 text-zinc-700 focus:ring-red-200 placeholder:text-zinc-300",
      "placeholder:text-zinc-300",
    ].join(" ");

    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold text-zinc-900">{props.title}</div>

        <MyPageUI.BulletList items={props.bullets} />

        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="text-xs font-semibold text-red-700">
            {props.warningTitle}
          </div>

          <div className="mt-1 text-[11px] text-red-700">
            {props.confirmHintPrefix}
            <span className="font-semibold">{props.confirmKeyword}</span>
            {props.confirmHintSuffix}
          </div>

          <input
            value={props.deleteConfirmText}
            onChange={(e) =>
              props.onChangeDeleteConfirmText(e.target.value.trim())
            }
            placeholder={props.confirmKeyword}
            className={inputClass}
            inputMode="text"
            disabled={props.deletingAccount}
          />

          <MyPageUI.DangerButton
            type="button"
            onClick={props.onDeleteAccount}
            disabled={!props.canSubmitDelete}
            className="mt-3 bg-red-600"
          >
            {props.deletingAccount
              ? props.deletingAccountLabel
              : props.deleteAccountLabel}
          </MyPageUI.DangerButton>

          {props.deleteAccountError ? (
            <p className="mt-2 text-xs text-red-700 whitespace-pre-wrap">
              {props.deleteAccountError}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
};
