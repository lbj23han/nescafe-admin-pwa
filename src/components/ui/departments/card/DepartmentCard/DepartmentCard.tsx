"use client";

import type { DepartmentCardProps } from "../DepartmentCard.types";
import * as UI from "./DepartmentCardUI";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import { useDepartmentCard } from "./useDepartmentCard";
import { NameEditorNode } from "./parts/NameEditorNode";
import { AddHistoryForm } from "./parts/AddHistoryForm";
import { HistorySection } from "./parts/HistorySection";

export function DepartmentCard(props: DepartmentCardProps) {
  const h = useDepartmentCard(props);
  const { department, expanded, onDelete, readOnly } = props;

  const allowEdit = !readOnly;

  return (
    <UI.Root expanded={expanded} onClick={h.guardedToggle}>
      <UI.Header
        name={department.name}
        nameNode={
          expanded && allowEdit && h.name.editing ? (
            <NameEditorNode
              value={h.name.draft}
              onChange={h.name.setDraft}
              onSave={h.name.save}
            />
          ) : undefined
        }
        deposit={department.deposit}
        debt={department.debt}
        expanded={expanded}
        onToggleClick={h.guardedToggle}
        onDeleteClick={
          expanded && allowEdit && onDelete ? h.departmentDelete : undefined
        }
        editingName={expanded && allowEdit ? h.name.editing : false}
        onEditNameToggleClick={
          expanded && allowEdit ? h.name.toggle : undefined
        }
      />

      {expanded && (
        <UI.ExpandedContainer>
          {/* ✅ readOnly면 히스토리 추가 폼 숨김 */}
          {allowEdit ? (
            <AddHistoryForm
              value={h.form.value}
              setValue={h.form.setValue}
              onSubmit={h.form.submit}
            />
          ) : null}

          <UI.HistoryContainer
            editMode={allowEdit ? h.historyEditMode.enabled : false}
            stickyHeader
            actions={
              allowEdit && h.history.hasHistory ? (
                <UI.TinyButton
                  type="button"
                  onClick={(e) => (
                    e.stopPropagation(), h.historyEditMode.toggle()
                  )}
                >
                  {h.historyEditMode.enabled
                    ? DEPARTMENT_CARD_COPY.historyEdit.toggleOff
                    : DEPARTMENT_CARD_COPY.historyEdit.toggleOn}
                </UI.TinyButton>
              ) : undefined
            }
          >
            {allowEdit ? (
              <HistorySection
                history={h.history.reversed}
                editMode={h.historyEditMode.enabled}
                editingId={h.row.editingId}
                draft={h.row.draft}
                setDraft={h.row.setDraft}
                onStartEdit={h.row.start}
                onCancel={h.row.cancel}
                onSave={h.row.save}
              />
            ) : (
              <HistorySection history={h.history.reversed} editMode={false} />
            )}
          </UI.HistoryContainer>
        </UI.ExpandedContainer>
      )}
    </UI.Root>
  );
}
