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
import type { MemberRow } from "@/app/(authed)/mypage/actions.members";
import {
  revokeMemberAction,
  getActiveMemberIdsAction,
  listMembersAction,
} from "@/app/(authed)/mypage/actions.members";

function uniqStrings(xs: (string | null | undefined)[]): string[] {
  const set = new Set<string>();
  for (const x of xs) {
    if (typeof x === "string" && x.length > 0) set.add(x);
  }
  return Array.from(set);
}

function safeTrim(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function useInvitations() {
  const [items, setItems] = useState<InvitationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<CreateInvitationResult | null>(
    null
  );

  // accepted 표시용: "현재shop 멤버인 user_id" 집합
  const [activeMemberUserIds, setActiveMemberUserIds] = useState<Set<string>>(
    () => new Set()
  );

  // accepted 표시용: user_id -> display_name 맵
  const [memberNameById, setMemberNameById] = useState<Map<string, string>>(
    () => new Map()
  );

  // revoke 상태 표시용
  const [revokingUserId, setRevokingUserId] = useState<string | null>(null);

  // cancel/revoke 원복용 스냅샷
  const snapshotRef = useRef<InvitationRow[] | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listInvitationsAction();
      setItems(data);

      // accepted_by userIds 수집
      const acceptedUserIds = uniqStrings(
        (data ?? [])
          .filter((x) => x.status === "accepted")
          .map((x) => x.accepted_by)
      );

      if (acceptedUserIds.length === 0) {
        setActiveMemberUserIds(new Set());
        setMemberNameById(new Map());
      } else {
        const ids = await getActiveMemberIdsAction(acceptedUserIds);
        setActiveMemberUserIds(new Set(ids));

        // 같은 shop의 멤버 프로필 이름도 함께 가져와 둔다
        // (accepted UI에서 profiles.display_name 우선 표시하기 위함)
        const members = (await listMembersAction()) as MemberRow[];
        const map = new Map<string, string>();

        for (const m of members ?? []) {
          const uid = safeTrim(m.user_id);
          const name = safeTrim(m.display_name);
          if (uid && name) map.set(uid, name);
        }

        setMemberNameById(map);
      }
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

      snapshotRef.current = items;
      setItems((prev) => prev.filter((x) => x.id !== invitationId));

      try {
        await cancelInvitationAction(invitationId);
        await refresh();
      } catch (e: unknown) {
        if (snapshotRef.current) setItems(snapshotRef.current);
        setError(getErrorMessage(e, "Failed to cancel invitation"));
        throw e;
      } finally {
        snapshotRef.current = null;
      }
    },
    [items, refresh]
  );

  const revoke = useCallback(
    async (targetUserId: string) => {
      if (!targetUserId) return;

      setError(null);
      setRevokingUserId(targetUserId);

      // optimistic: accepted_by가 target인 카드 즉시 제거
      snapshotRef.current = items;
      setItems((prev) => prev.filter((x) => x.accepted_by !== targetUserId));

      try {
        await revokeMemberAction(targetUserId);
        // refresh로 invitations + activeMemberUserIds + memberNameById 동기화
        await refresh();
      } catch (e: unknown) {
        if (snapshotRef.current) setItems(snapshotRef.current);
        setError(getErrorMessage(e, "Failed to revoke member"));
        throw e;
      } finally {
        snapshotRef.current = null;
        setRevokingUserId(null);
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

    // revoke
    revoke,
    revokingUserId,

    // accepted 필터링에 사용
    activeMemberUserIds,

    // accepted 표시 이름 소스
    memberNameById,
  };
}
