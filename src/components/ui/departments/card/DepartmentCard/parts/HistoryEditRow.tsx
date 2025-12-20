"use client";

import * as UI from "../DepartmentCardUI";
import {
  DEPARTMENT_CARD_COPY,
  DEPARTMENT_HISTORY_LABEL,
} from "@/constants/departments/card";
import type { HistoryType } from "@/lib/departmentStorage";
import type { HistoryEditDraft } from "../../DepartmentCard.types";

export function HistoryEditRow({
  draft,
  setDraft,
  onCancel,
  onSave,
}: {
  draft: HistoryEditDraft;
  setDraft: React.Dispatch<React.SetStateAction<HistoryEditDraft>>;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <li
      className="rounded-md border border-zinc-300 bg-white p-2 ring-2 ring-zinc-300/60"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <UI.FieldLabel>
            {DEPARTMENT_CARD_COPY.historyEditRow.label.type}
          </UI.FieldLabel>
          <UI.SelectField
            value={draft.type}
            onChange={(e) =>
              setDraft((p) => ({ ...p, type: e.target.value as HistoryType }))
            }
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
          <UI.FieldLabel>
            {DEPARTMENT_CARD_COPY.historyEditRow.label.amount}
          </UI.FieldLabel>
          <UI.AmountInput
            type="number"
            value={draft.amount}
            onChange={(e) =>
              setDraft((p) => ({ ...p, amount: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="mt-2">
        <UI.FieldLabel>
          {DEPARTMENT_CARD_COPY.historyEditRow.label.memo}
        </UI.FieldLabel>
        <UI.MemoInput
          value={draft.memo}
          onChange={(e) => setDraft((p) => ({ ...p, memo: e.target.value }))}
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <UI.TinyButton
          type="button"
          onClick={(e) => (e.stopPropagation(), onCancel())}
        >
          {DEPARTMENT_CARD_COPY.historyEditRow.button.cancel}
        </UI.TinyButton>
        <UI.TinyButton
          variant="primary"
          type="button"
          onClick={(e) => (e.stopPropagation(), onSave())}
        >
          {DEPARTMENT_CARD_COPY.historyEditRow.button.save}
        </UI.TinyButton>
      </div>
    </li>
  );
}
