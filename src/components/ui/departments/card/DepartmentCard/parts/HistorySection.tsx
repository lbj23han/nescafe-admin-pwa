"use client";

import * as UI from "../DepartmentCardUI";
import {
  formatHistoryAmount,
  formatHistoryDate,
  formatHistoryType,
  isPositiveHistory,
} from "@/lib/departmentHistoryFormat";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import type { Department } from "@/lib/departmentStorage";
import type { HistoryEditDraft } from "../../DepartmentCard.types";
import { HistoryEditRow } from "./HistoryEditRow";

export function HistorySection({
  history,
  editMode,
  editingId,
  draft,
  setDraft,
  onStartEdit,
  onCancel,
  onSave,
}: {
  history: Department["history"];
  editMode: boolean;
  editingId: string | null;
  draft: HistoryEditDraft;
  setDraft: React.Dispatch<React.SetStateAction<HistoryEditDraft>>;
  onStartEdit: (id: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  if (history.length === 0) return <UI.HistoryEmpty />;

  return (
    <UI.HistoryList
      items={history}
      renderItem={(h) => {
        const editing = editingId === h.id;
        if (editing)
          return (
            <HistoryEditRow
              key={h.id}
              draft={draft}
              setDraft={setDraft}
              onCancel={onCancel}
              onSave={onSave}
            />
          );

        return (
          <div
            key={h.id}
            className={[
              "rounded-md px-2 py-1",
              editMode ? "hover:bg-zinc-50" : "",
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
                editMode ? (
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
