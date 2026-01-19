"use client";

import type { FindEmailPageViewProps } from "./FindEmailPage.types";
import { FindEmailPageUI as UI } from "./FindEmailPageUI";
import { FIND_EMAIL_COPY as COPY } from "@/constants/findEmail";

export function FindEmailPageView(props: FindEmailPageViewProps) {
  return (
    <UI.Layout>
      <UI.Header title={props.title} subtitle={props.subtitle} />

      <UI.Section>
        {props.hint ? <UI.Hint>{props.hint}</UI.Hint> : null}

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

        <UI.LinkAction
          onClick={props.onGoPasswordReset}
          disabled={props.loading}
        >
          {COPY.actions.goPasswordReset}
        </UI.LinkAction>

        <UI.LinkAction onClick={props.onBackToLogin} disabled={props.loading}>
          {COPY.actions.backToLogin}
        </UI.LinkAction>
      </UI.Section>
    </UI.Layout>
  );
}
