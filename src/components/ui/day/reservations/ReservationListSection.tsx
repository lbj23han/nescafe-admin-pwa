"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "../DayUI";
import type { ReservationListProps } from "../DayPage.types";
import { ReservationRow } from "./parts/ReservationRow";
import { ReservationEditFields } from "./parts/ReservationEditFields";
import { RESERVATION_UI } from "./reservation.ui";

export function ReservationListSection({
  list,
  departments,
  departmentsLoading,
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
        <p className={RESERVATION_UI.emptyText}>{DAY_PAGE_COPY.emptyList}</p>
      </DayUI.Section>
    );
  }

  return (
    <DayUI.Section>
      <ul className={RESERVATION_UI.stack2}>
        {list.map((r) => {
          const isEditing = editingId === r.id;

          return (
            <li key={r.id}>
              <ReservationRow
                r={r}
                canManageActions={canManageActions}
                onEdit={onEdit}
                onComplete={onComplete}
                onCancel={onCancel}
              />

              {canManageActions && isEditing && editForm ? (
                <ReservationEditFields
                  editForm={editForm}
                  departments={departments}
                  departmentsLoading={departmentsLoading}
                  onChangeEditField={onChangeEditField}
                  onSubmitEdit={onSubmitEdit}
                  onCancelEdit={onCancelEdit}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </DayUI.Section>
  );
}
