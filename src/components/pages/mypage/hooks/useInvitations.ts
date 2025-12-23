"use client";

import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CreateInvitationInput,
  CreateInvitationResult,
  InvitationRow,
} from "@/lib/contracts/invitations";
import {
  createInvitationAction,
  listInvitationsAction,
  cancelInvitationAction,
} from "@/app/(authed)/mypage/actions.invitations";

export function useInvitations() {
  const [items, setItems] = useState<InvitationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<CreateInvitationResult | null>(
    null
  );

  // cancel 원복용 스냅샷 (여러 번 취소해도 안전하게)
  const snapshotRef = useRef<InvitationRow[] | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInvitationsAction();
      setItems(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to load invitations"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateInvitationInput) => {
      setCreating(true);
      setError(null);
      try {
        const res = await createInvitationAction(input);
        setLastCreated(res);
        await refresh();
        return res;
      } catch (e: unknown) {
        setError(getErrorMessage(e, "Failed to create invitation"));
        throw e;
      } finally {
        setCreating(false);
      }
    },
    [refresh]
  );

  const cancel = useCallback(
    async (invitationId: string) => {
      if (!invitationId) return;

      setError(null);

      // ✅ optimistic: 즉시 UI에서 제거
      snapshotRef.current = items;
      setItems((prev) => prev.filter((x) => x.id !== invitationId));

      try {
        await cancelInvitationAction(invitationId);
        // 서버가 성공했으면 refresh로 동기화 (취소된 항목은 pending 조회에서 빠져있거나 cancelled로 남아있을 수 있음)
        await refresh();
      } catch (e: unknown) {
        // ❌ 실패 시 원복
        if (snapshotRef.current) setItems(snapshotRef.current);
        setError(getErrorMessage(e, "Failed to cancel invitation"));
        throw e;
      } finally {
        snapshotRef.current = null;
      }
    },
    [items, refresh]
  );

  return {
    items,
    loading,
    creating,
    error,
    lastCreated,
    refresh,
    create,
    cancel,
  };
}
