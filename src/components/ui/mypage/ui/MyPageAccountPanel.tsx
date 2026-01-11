"use client";

import { BulletList } from "./MyPageUI.helpers";
import { DangerButton } from "./MyPageUI.controls";

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

export function AccountPanel(props: AccountPanelProps) {
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

      <BulletList items={props.bullets} />

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

        <DangerButton
          type="button"
          onClick={props.onDeleteAccount}
          disabled={!props.canSubmitDelete}
          className="mt-3 bg-red-600"
        >
          {props.deletingAccount
            ? props.deletingAccountLabel
            : props.deleteAccountLabel}
        </DangerButton>

        {props.deleteAccountError ? (
          <p className="mt-2 whitespace-pre-wrap text-xs text-red-700">
            {props.deleteAccountError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
