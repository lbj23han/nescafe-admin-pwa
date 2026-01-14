"use client";

import { useCallback, useMemo, useState } from "react";

type ReservationLike = {
  id: string;
  departmentId?: string | null;
};

type CompleteFn = (
  id: string,
  type?: "debt",
  opts?: { skipConfirm?: boolean }
) => Promise<unknown> | unknown;

export function useReservationSettleFlow(args: {
  list: ReservationLike[];
  onComplete: CompleteFn;
}) {
  const { list, onComplete } = args;

  const [settleOpen, setSettleOpen] = useState(false);
  const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(
    null
  );
  const [settleLoading, setSettleLoading] = useState(false);

  const byId = useMemo(() => {
    const m = new Map<string, ReservationLike>();
    for (const x of list) m.set(x.id, x);
    return m;
  }, [list]);

  const onClickComplete = useCallback(
    (id: string) => {
      const target = byId.get(id);
      if (!target) return;

      const hasDepartmentLink = !!target.departmentId;

      // direct input → 기존 confirm 사용
      if (!hasDepartmentLink) {
        onComplete(id);
        return;
      }

      // 연동 예약 → 정산 안내 sheet
      setPendingCompleteId(id);
      setSettleOpen(true);
    },
    [byId, onComplete]
  );

  const closeSettle = useCallback(() => {
    if (settleLoading) return;
    setSettleOpen(false);
    setPendingCompleteId(null);
  }, [settleLoading]);

  const confirmSettle = useCallback(async () => {
    if (!pendingCompleteId) return;

    setSettleLoading(true);
    try {
      await Promise.resolve(
        onComplete(pendingCompleteId, "debt", { skipConfirm: true })
      );
      setSettleOpen(false);
      setPendingCompleteId(null);
    } finally {
      setSettleLoading(false);
    }
  }, [onComplete, pendingCompleteId]);

  return {
    settleOpen,
    settleLoading,
    onClickComplete,
    closeSettle,
    confirmSettle,
  };
}
