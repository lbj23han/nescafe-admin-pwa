"use client";

import { useState } from "react";
import { RESET_PASSWORD_COPY } from "@/constants/resetPassword";
import type { ResetPasswordPageViewProps } from "./ResetPasswordPage.types";
import { ResetPasswordPageUI as UI } from "./ResetPasswordPageUI";

export function ResetPasswordPageView(props: ResetPasswordPageViewProps) {
  const [pwFocused, setPwFocused] = useState(false);

  const pwMismatch =
    props.password.length > 0 &&
    props.confirmPassword.length > 0 &&
    props.password !== props.confirmPassword;

  const policyValid = props.passwordPolicyValid ?? true;
  const policyErrors = props.passwordPolicyErrors ?? [];

  const showPolicy = pwFocused;

  return (
    <UI.Layout>
      <UI.Header title={props.title} subtitle={props.subtitle} />

      <UI.Section>
        <UI.Field
          label={RESET_PASSWORD_COPY.fields.password}
          value={props.password}
          onChange={props.onChangePassword}
          placeholder={RESET_PASSWORD_COPY.placeholders.password}
          disabled={props.loading}
          onFocus={() => setPwFocused(true)}
          onBlur={() => setPwFocused(false)}
        />

        {/* 정책 안내: 포커스일 때만 */}
        {showPolicy ? (
          <div className="text-[11px] text-zinc-500">
            <div className="font-medium text-zinc-600">
              {RESET_PASSWORD_COPY.helper.passwordPolicyTitle}
            </div>
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              {RESET_PASSWORD_COPY.helper.passwordPolicyLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            {props.password.length > 0 && !policyValid ? (
              <div className="mt-2 text-red-600">{policyErrors[0]}</div>
            ) : null}
          </div>
        ) : null}

        <div>
          <UI.Field
            label={RESET_PASSWORD_COPY.fields.confirmPassword}
            value={props.confirmPassword}
            onChange={props.onChangeConfirmPassword}
            placeholder={RESET_PASSWORD_COPY.placeholders.password}
            disabled={props.loading}
          />

          {pwMismatch ? (
            <UI.HelperError>
              {RESET_PASSWORD_COPY.helper.passwordMismatch}
            </UI.HelperError>
          ) : null}
        </div>

        {props.error ? <UI.Error>{props.error}</UI.Error> : null}
        {props.doneMessage ? (
          <UI.Success>{props.doneMessage}</UI.Success>
        ) : null}

        <UI.PrimaryAction onClick={props.onSubmit} disabled={!props.canSubmit}>
          {props.loading
            ? RESET_PASSWORD_COPY.actions.resetting
            : RESET_PASSWORD_COPY.actions.reset}
        </UI.PrimaryAction>

        <UI.SecondaryAction
          onClick={props.onBackToLogin}
          disabled={props.loading}
        >
          {RESET_PASSWORD_COPY.actions.backToLogin}
        </UI.SecondaryAction>
      </UI.Section>
    </UI.Layout>
  );
}
