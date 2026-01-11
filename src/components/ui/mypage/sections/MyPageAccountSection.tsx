"use client";

import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { MYPAGE_COPY } from "@/constants/mypage";

type Props = {
  accountOpen: boolean;
  onToggleAccountOpen: () => void;

  deleteConfirmText: string;
  onChangeDeleteConfirmText: (v: string) => void;
  canSubmitDelete: boolean;

  deletingAccount: boolean;
  deleteAccountError?: string;
  onDeleteAccount: () => Promise<void>;
};

export function MyPageAccountSection(props: Props) {
  const {
    accountOpen,
    onToggleAccountOpen,
    deleteConfirmText,
    onChangeDeleteConfirmText,
    deletingAccount,
    canSubmitDelete,
    deleteAccountError,
    onDeleteAccount,
  } = props;

  return (
    <UI.CollapseToggleArea className="mt-3">
      <UI.DangerButton type="button" onClick={onToggleAccountOpen}>
        {accountOpen
          ? MYPAGE_COPY.actions.closeAccount
          : MYPAGE_COPY.actions.openAccount}
      </UI.DangerButton>

      <UI.Collapse open={accountOpen}>
        <UI.AccountPanel
          title={MYPAGE_COPY.account.title}
          bullets={MYPAGE_COPY.account.bullets}
          warningTitle={MYPAGE_COPY.account.warningTitle}
          confirmHintPrefix={MYPAGE_COPY.account.confirmHintPrefix}
          confirmKeyword={MYPAGE_COPY.account.confirmKeyword}
          confirmHintSuffix={MYPAGE_COPY.account.confirmHintSuffix}
          deleteConfirmText={deleteConfirmText}
          onChangeDeleteConfirmText={onChangeDeleteConfirmText}
          deletingAccount={deletingAccount}
          canSubmitDelete={canSubmitDelete}
          deleteAccountLabel={MYPAGE_COPY.actions.deleteAccount}
          deletingAccountLabel={MYPAGE_COPY.actions.deletingAccount}
          deleteAccountError={deleteAccountError}
          onDeleteAccount={onDeleteAccount}
        />
      </UI.Collapse>
    </UI.CollapseToggleArea>
  );
}
