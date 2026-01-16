"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "../../DayUI";
import type { Reservation } from "@/lib/domain/reservation";

type Props = {
  r: Reservation;
  canManageActions: boolean;
  onEdit: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
};

export function ReservationRow({
  r,
  canManageActions,
  onEdit,
  onComplete,
  onCancel,
}: Props) {
  const isCompleted = r.status === "completed";

  return (
    <DayUI.ReservationCard isCompleted={isCompleted}>
      <DayUI.ReservationTitle>
        {r.department} · {r.menu}
      </DayUI.ReservationTitle>

      <DayUI.MetaText>
        {DAY_PAGE_COPY.format.reservationMeta({
          amount: r.amount,
          time: r.time,
          location: r.location,
        })}
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
              disabled={isCompleted}
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
              disabled={isCompleted}
              onClick={() => onCancel(r.id)}
            >
              {DAY_PAGE_COPY.buttons.cancel}
            </DayUI.ActionButton>
          </DayUI.ActionGroup>
        ) : null}
      </DayUI.FooterRow>
    </DayUI.ReservationCard>
  );
}
