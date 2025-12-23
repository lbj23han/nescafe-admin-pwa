"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "./DayUI";
import type { ReservationListProps } from "./DayPage.types";

export function ReservationListSection({
  list,
  onComplete,
  onCancel,
  onEdit,
  editingId,
  editForm,
  onChangeEditField,
  onSubmitEdit,
  onCancelEdit,
  canManageActions,
}: ReservationListProps) {
  if (list.length === 0) {
    return (
      <DayUI.Section>
        <p className="text-xs text-black">{DAY_PAGE_COPY.emptyList}</p>
      </DayUI.Section>
    );
  }

  return (
    <DayUI.Section>
      <ul className="space-y-2">
        {list.map((r) => {
          const isCompleted = r.status === "completed";
          const isEditing = editingId === r.id;

          return (
            <DayUI.ReservationCard key={r.id} isCompleted={isCompleted}>
              <DayUI.ReservationTitle>
                {r.department} · {r.menu}
              </DayUI.ReservationTitle>

              <DayUI.MetaText>
                금액: {r.amount?.toLocaleString()}원
                {r.time && ` · 시간: ${r.time}`}
                {r.location && ` · 위치: ${r.location}`}
              </DayUI.MetaText>

              <DayUI.FooterRow>
                <DayUI.StatusText>
                  {isCompleted
                    ? DAY_PAGE_COPY.status.completed
                    : DAY_PAGE_COPY.status.inProgress}
                </DayUI.StatusText>

                {canManageActions ? (
                  <DayUI.ActionGroup>
                    <DayUI.ActionButton
                      variant="edit"
                      onClick={() => onEdit(r.id)}
                    >
                      {DAY_PAGE_COPY.buttons.edit}
                    </DayUI.ActionButton>

                    <DayUI.ActionButton
                      variant="complete"
                      disabled={isCompleted}
                      onClick={() => onComplete(r.id)}
                    >
                      {DAY_PAGE_COPY.buttons.complete}
                    </DayUI.ActionButton>

                    <DayUI.ActionButton
                      variant="cancel"
                      onClick={() => onCancel(r.id)}
                    >
                      {DAY_PAGE_COPY.buttons.cancel}
                    </DayUI.ActionButton>
                  </DayUI.ActionGroup>
                ) : null}
              </DayUI.FooterRow>

              {/* ✅ 수정모드 UI도 owner/admin만 */}
              {canManageActions && isEditing && editForm ? (
                <DayUI.EditSection>
                  <div className="space-y-3">
                    <DayUI.Field label={DAY_PAGE_COPY.form.department.label}>
                      <DayUI.TextInput
                        value={editForm.department}
                        onChange={(v) => onChangeEditField?.("department", v)}
                        placeholder={DAY_PAGE_COPY.form.department.placeholder}
                      />
                    </DayUI.Field>

                    <DayUI.Field label={DAY_PAGE_COPY.form.menu.label}>
                      <DayUI.TextInput
                        value={editForm.menu}
                        onChange={(v) => onChangeEditField?.("menu", v)}
                        placeholder={DAY_PAGE_COPY.form.menu.placeholder}
                      />
                    </DayUI.Field>

                    <DayUI.Field label={DAY_PAGE_COPY.form.location.label}>
                      <DayUI.TextInput
                        value={editForm.location}
                        onChange={(v) => onChangeEditField?.("location", v)}
                        placeholder={DAY_PAGE_COPY.form.location.placeholder}
                      />
                    </DayUI.Field>

                    <DayUI.Field label={DAY_PAGE_COPY.form.time.label}>
                      <DayUI.TextInput
                        value={editForm.time}
                        onChange={(v) => onChangeEditField?.("time", v)}
                        placeholder={DAY_PAGE_COPY.form.time.placeholder}
                      />
                    </DayUI.Field>

                    <DayUI.Field label={DAY_PAGE_COPY.form.amount.label}>
                      <DayUI.TextInput
                        value={editForm.amount}
                        onChange={(v) => onChangeEditField?.("amount", v)}
                        placeholder={DAY_PAGE_COPY.form.amount.placeholder}
                        numeric
                      />
                    </DayUI.Field>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <DayUI.ActionButton
                      variant="edit"
                      onClick={() => onCancelEdit?.()}
                    >
                      {DAY_PAGE_COPY.buttons.editCancel}
                    </DayUI.ActionButton>
                    <DayUI.ActionButton
                      variant="complete"
                      onClick={() => onSubmitEdit?.()}
                    >
                      {DAY_PAGE_COPY.buttons.editSave}
                    </DayUI.ActionButton>
                  </div>
                </DayUI.EditSection>
              ) : null}
            </DayUI.ReservationCard>
          );
        })}
      </ul>
    </DayUI.Section>
  );
}
