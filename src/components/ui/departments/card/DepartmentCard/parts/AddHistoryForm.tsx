"use client";

import * as UI from "../../DepartmentCardUI";
import {
  DEPARTMENT_CARD_COPY,
  DEPARTMENT_HISTORY_LABEL,
} from "@/constants/departments/card";
import { type HistoryType } from "@/lib/departmentStorage";

export function AddHistoryForm({
  value,
  setValue,
  onSubmit,
}: {
  value: { type: HistoryType; amount: string; memo: string };
  setValue: {
    setType: (v: HistoryType) => void;
    setAmount: (v: string) => void;
    setMemo: (v: string) => void;
  };
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <UI.FormContainer onSubmit={onSubmit}>
      <UI.FormRow>
        <div className="flex-1">
          <UI.FieldLabel>{DEPARTMENT_CARD_COPY.field.type}</UI.FieldLabel>
          <UI.SelectField
            value={value.type}
            onChange={(e) => setValue.setType(e.target.value as HistoryType)}
          >
            <option value="deposit">{DEPARTMENT_HISTORY_LABEL.deposit}</option>
            <option value="order">{DEPARTMENT_HISTORY_LABEL.order}</option>
            <option value="debtPayment">
              {DEPARTMENT_HISTORY_LABEL.debtPayment}
            </option>
            <option value="payment">{DEPARTMENT_HISTORY_LABEL.payment}</option>
          </UI.SelectField>
        </div>

        <div className="w-28">
          <UI.FieldLabel>{DEPARTMENT_CARD_COPY.field.amount}</UI.FieldLabel>
          <UI.AmountInput
            type="number"
            placeholder={DEPARTMENT_CARD_COPY.placeholder.amount}
            value={value.amount}
            onChange={(e) => setValue.setAmount(e.target.value)}
          />
        </div>
      </UI.FormRow>

      <div>
        <UI.FieldLabel>{DEPARTMENT_CARD_COPY.field.memo}</UI.FieldLabel>
        <UI.MemoInput
          placeholder={DEPARTMENT_CARD_COPY.placeholder.memo}
          value={value.memo}
          onChange={(e) => setValue.setMemo(e.target.value)}
        />
      </div>

      <UI.SubmitButton type="submit">
        {DEPARTMENT_CARD_COPY.submit}
      </UI.SubmitButton>
    </UI.FormContainer>
  );
}
