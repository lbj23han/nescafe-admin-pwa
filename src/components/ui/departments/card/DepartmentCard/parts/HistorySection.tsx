"use client";

import * as UI from "../DepartmentCardUI";
import {
  formatHistoryAmount,
  formatHistoryDate,
  formatHistoryType,
  isPositiveHistory,
} from "@/lib/departmentHistoryFormat";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import type { Department } from "@/lib/storage/departments.local";
import type { HistoryEditDraft } from "../../DepartmentCard.types";
import { HistoryEditRow } from "./HistoryEditRow";

type Props = {
  history: Department["history"];
  editMode: boolean;

  editingId?: string | null;
  draft?: HistoryEditDraft;
  setDraft?: React.Dispatch<React.SetStateAction<HistoryEditDraft>>;
  onStartEdit?: (id: string) => void;
  onCancel?: () => void;
  onSave?: () => void;
};

export function HistorySection({
  history,
  editMode,
  editingId = null,
  draft,
  setDraft,
  onStartEdit,
  onCancel,
  onSave,
}: Props) {
  if (history.length === 0) return <UI.HistoryEmpty />;

  const canEditRows =
    !!onStartEdit && !!onCancel && !!onSave && !!draft && !!setDraft;

  return (
    <UI.HistoryList
      items={history}
      renderItem={(h) => {
        const editing = canEditRows && editingId === h.id;

        if (editing) {
          return (
            <HistoryEditRow
              key={h.id}
              draft={draft as HistoryEditDraft}
              setDraft={
                setDraft as React.Dispatch<
                  React.SetStateAction<HistoryEditDraft>
                >
              }
              onCancel={onCancel as () => void}
              onSave={onSave as () => void}
            />
          );
        }

        return (
          <div
            key={h.id}
            className={[
              "rounded-md px-2 py-1",
              editMode && canEditRows ? "hover:bg-zinc-50" : "",
            ].join(" ")}
            onClick={(e) => e.stopPropagation()}
          >
            <UI.HistoryItemContent
              typeLabel={formatHistoryType(h.type)}
              memo={h.memo}
              dateLabel={formatHistoryDate(h.date)}
              amountLabel={formatHistoryAmount(h)}
              positive={isPositiveHistory(h)}
              actions={
                editMode && canEditRows ? (
                  <UI.TinyButton
                    type="button"
                    onClick={(e) => (e.stopPropagation(), onStartEdit(h.id))}
                    aria-label={DEPARTMENT_CARD_COPY.historyEdit.editActionAria}
                    title={DEPARTMENT_CARD_COPY.historyEdit.editActionTitle}
                  >
                    {DEPARTMENT_CARD_COPY.historyEdit.editActionIcon}
                  </UI.TinyButton>
                ) : undefined
              }
            />
          </div>
        );
      }}
    />
  );
}
