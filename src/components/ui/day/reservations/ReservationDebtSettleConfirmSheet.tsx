"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "../DayUI";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export function ReservationDebtSettleConfirmSheet({
  open,
  onClose,
  onConfirm,
  loading,
}: Props) {
  if (!open) return null;

  return (
    <DayUI.SheetOverlay onBackdropClick={onClose}>
      <DayUI.SheetContainer>
        <DayUI.SheetHeader>
          <div>
            <DayUI.SheetTitle>
              {DAY_PAGE_COPY.settleConfirm.title}
            </DayUI.SheetTitle>
            <DayUI.SheetDesc>
              {DAY_PAGE_COPY.settleConfirm.body}
            </DayUI.SheetDesc>
          </div>
          <DayUI.SheetCloseButton onClick={onClose} disabled={loading}>
            {DAY_PAGE_COPY.settleConfirm.cancel}
          </DayUI.SheetCloseButton>
        </DayUI.SheetHeader>

        <DayUI.SheetFooter>
          <DayUI.SheetActionButton
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {DAY_PAGE_COPY.settleConfirm.cancel}
          </DayUI.SheetActionButton>

          <DayUI.SheetActionButton
            variant="primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? DAY_PAGE_COPY.settleConfirm.loading
              : DAY_PAGE_COPY.settleConfirm.confirm}
          </DayUI.SheetActionButton>
        </DayUI.SheetFooter>
      </DayUI.SheetContainer>
    </DayUI.SheetOverlay>
  );
}
