"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Reservation } from "@/hooks/reservation";
import { DayPageUI as UI } from "@/components/ui/day/DayPage.view";
import { ReservationDebtSettleConfirmSheet } from "@/components/ui/day/ReservationDebtSettleConfirmSheet";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  date: string;
};

function normalizeRole(role: unknown) {
  return String(role ?? "")
    .trim()
    .toLowerCase();
}

async function fetchMyRole(): Promise<string> {
  const { data: sessionRes, error: sessionErr } =
    await supabase.auth.getSession();
  if (sessionErr) throw sessionErr;

  const userId = sessionRes.session?.user.id;
  if (!userId) return "unknown";

  const byUserId = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle<{ role: string | null }>();

  if (byUserId.error) throw byUserId.error;
  if (byUserId.data?.role) return byUserId.data.role;

  const byId = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle<{ role: string | null }>();

  if (byId.error) throw byId.error;
  return byId.data?.role ?? "unknown";
}

export function DayDetailPageContainer({ date }: Props) {
  const router = useRouter();
  const isReady = useAuthGuard();

  const [roleKey, setRoleKey] = useState<string>("unknown");
  const [settleOpen, setSettleOpen] = useState(false);
  const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(
    null
  );
  const [settleLoading, setSettleLoading] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    let mounted = true;

    (async () => {
      try {
        const role = await fetchMyRole();
        if (mounted) setRoleKey(normalizeRole(role));
      } catch {
        if (mounted) setRoleKey("unknown");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isReady]);

  const canManageActions = useMemo(() => {
    return roleKey === "owner" || roleKey === "admin";
  }, [roleKey]);

  const {
    list,
    department,
    menu,
    amount,
    time,
    location,
    showForm,
    formattedDate,
    setDepartment,
    setMenu,
    setTime,
    setLocation,
    handleAmountChange,
    handleAddButtonClick,
    handleComplete,
    handleCancel,
    handleEdit,
    editingId,
    editForm,
    handleChangeEditField,
    handleSubmitEdit,
    handleCancelEdit,
    departmentMode,
    departments,
    selectedDepartmentId,
    departmentsLoading,
    setDepartmentMode,
    setSelectedDepartmentId,
  } = Reservation.useDay(date);

  const handleClickComplete = (id: string) => {
    const target = list.find((x) => x.id === id);
    if (!target) return;

    const hasDepartmentLink = !!target.departmentId;

    if (!hasDepartmentLink) {
      // direct input → 기존 confirm 사용
      handleComplete(id);
      return;
    }

    // 연동 예약 → 정산 안내 sheet
    setPendingCompleteId(id);
    setSettleOpen(true);
  };

  const closeSettle = () => {
    if (settleLoading) return;
    setSettleOpen(false);
    setPendingCompleteId(null);
  };

  const confirmSettle = async () => {
    if (!pendingCompleteId) return;

    setSettleLoading(true);
    try {
      await Promise.resolve(
        handleComplete(pendingCompleteId, "debt", { skipConfirm: true })
      );

      setSettleOpen(false);
      setPendingCompleteId(null);
    } finally {
      setSettleLoading(false);
    }
  };

  if (!isReady) return null;

  return (
    <UI.Layout>
      <UI.Header dateText={formattedDate} onBack={() => router.back()} />

      <UI.Main>
        <UI.ReservationList
          list={list}
          onComplete={handleClickComplete}
          onCancel={handleCancel}
          onEdit={handleEdit}
          editingId={editingId}
          editForm={editForm}
          onChangeEditField={handleChangeEditField}
          onSubmitEdit={handleSubmitEdit}
          onCancelEdit={handleCancelEdit}
          canManageActions={canManageActions}
        />

        {showForm && (
          <UI.ReservationForm
            department={department}
            menu={menu}
            location={location}
            time={time}
            amount={amount}
            onChangeDepartment={setDepartment}
            onChangeMenu={setMenu}
            onChangeLocation={setLocation}
            onChangeTime={setTime}
            onChangeAmount={handleAmountChange}
            departmentMode={departmentMode}
            departments={departments}
            selectedDepartmentId={selectedDepartmentId}
            departmentsLoading={departmentsLoading}
            onChangeDepartmentMode={setDepartmentMode}
            onChangeSelectedDepartmentId={setSelectedDepartmentId}
          />
        )}

        {canManageActions && editingId === null && (
          <UI.AddButton showForm={showForm} onClick={handleAddButtonClick} />
        )}
      </UI.Main>

      <ReservationDebtSettleConfirmSheet
        open={settleOpen}
        onClose={closeSettle}
        onConfirm={confirmSettle}
        loading={settleLoading}
      />
    </UI.Layout>
  );
}
