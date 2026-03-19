"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "../../DayUI";
import type { Reservation, SettlementType } from "@/lib/domain/reservation";

type Props = {
  r: Reservation;
  expanded: boolean;
  canManageActions: boolean;
  onToggleExpand: () => void;
  onEdit: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
};

function stripUnitPrice(menu: string): string {
  return (menu ?? "")
    .replace(/\(\d+\)/g, "")
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatAmount(amount?: number) {
  if (amount == null) return "미입력";
  return `${amount.toLocaleString()}원`;
}

function formatValue(value?: string | null) {
  if (!value || !value.trim()) return "미입력";
  return value;
}

function formatSettlementType(settleType?: SettlementType | null) {
  if (!settleType) return "없음";
  return settleType === "deposit" ? "예치금 차감" : "미수 처리";
}

export function ReservationRow({
  r,
  expanded,
  canManageActions,
  onToggleExpand,
  onEdit,
  onComplete,
  onCancel,
}: Props) {
  const isCompleted = r.status === "completed";

  return (
    <DayUI.ReservationCard isCompleted={isCompleted}>
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <DayUI.ReservationTitle>
              {r.department} · {stripUnitPrice(r.menu)}
            </DayUI.ReservationTitle>

            <DayUI.MetaText>
              {DAY_PAGE_COPY.format.reservationMeta({
                amount: r.amount,
                time: r.time,
                location: r.location,
              })}
            </DayUI.MetaText>
          </div>

          <span className="shrink-0 pt-0.5 text-[11px] text-zinc-500">
            {expanded ? "접기" : "상세"}
          </span>
        </div>
      </button>

      {expanded ? (
        <div className="mt-3 border-t border-zinc-200 pt-3 text-[11px] text-zinc-700 space-y-2">
          <div className="grid grid-cols-[64px_1fr] gap-x-2 gap-y-1">
            <span className="text-zinc-500">부서</span>
            <span>{formatValue(r.department)}</span>

            <span className="text-zinc-500">메뉴</span>
            <span className="break-words">{formatValue(r.menu)}</span>

            <span className="text-zinc-500">시간</span>
            <span>{formatValue(r.time)}</span>

            <span className="text-zinc-500">장소</span>
            <span>{formatValue(r.location)}</span>

            <span className="text-zinc-500">금액</span>
            <span>{formatAmount(r.amount)}</span>

            <span className="text-zinc-500">상태</span>
            <span>
              {isCompleted
                ? DAY_PAGE_COPY.status.completed
                : DAY_PAGE_COPY.status.inProgress}
            </span>

            <span className="text-zinc-500">정산 방식</span>
            <span>{formatSettlementType(r.settleType)}</span>

            <span className="text-zinc-500">메모</span>
            <span className="break-words">{formatValue(r.memo)}</span>
          </div>
        </div>
      ) : null}

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
