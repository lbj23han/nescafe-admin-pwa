"use client";

import type { ResetPasswordRequestPageViewProps } from "./ResetPasswordRequestPage.types";
import { ResetPasswordRequestPageUI as UI } from "./ResetPasswordRequestPageUI";
import { RESET_PASSWORD_REQUEST_COPY as COPY } from "@/constants/resetPasswordRequest";

export function ResetPasswordRequestPageView(
  props: ResetPasswordRequestPageViewProps
) {
  return (
    <UI.Layout>
      <UI.Header title={props.title} subtitle={props.subtitle} />

      <UI.Section>
        <UI.Field
          label={COPY.fields.email}
          value={props.email}
          onChange={props.onChangeEmail}
          placeholder={COPY.placeholders.email}
          disabled={props.loading}
        />

        {props.error ? <UI.Error>{props.error}</UI.Error> : null}
        {props.doneMessage ? (
          <UI.Success>{props.doneMessage}</UI.Success>
        ) : null}

        <UI.PrimaryAction onClick={props.onSubmit} disabled={!props.canSubmit}>
          {props.loading ? COPY.actions.sending : COPY.actions.send}
        </UI.PrimaryAction>

        <UI.SecondaryAction
          onClick={props.onBackToLogin}
          disabled={props.loading}
        >
          {COPY.actions.backToLogin}
        </UI.SecondaryAction>
      </UI.Section>
    </UI.Layout>
  );
}
