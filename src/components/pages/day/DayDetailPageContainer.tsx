"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Reservation } from "@/hooks/reservation";
import { DayPageView } from "@/components/ui/day/DayPage.view";
import { ReservationDebtSettleConfirmSheet } from "@/components/ui/day/reservations";
import { useMyRoleKey } from "@/components/ui/day/hooks/useMyRoleKey";
import { useReservationSettleFlow } from "@/components/ui/day/hooks/useReservationSettleFlow";
import type {
  PrefillItem,
  DayReservationPrefillQuery,
} from "@/hooks/ai/internal/prefill/prefill";
import { toPrefillKey } from "@/hooks/ai/internal/prefill/prefill";

type AiPrefillWithParsed =
  | (DayReservationPrefillQuery & { parsedItems: PrefillItem[] | null })
  | null;

type Props = {
  date: string;
  aiPrefill?: AiPrefillWithParsed;
};

export function DayDetailPageContainer({ date, aiPrefill = null }: Props) {
  const router = useRouter();
  const isReady = useAuthGuard();

  const role = useMyRoleKey(isReady);

  const appliedKeyRef = useRef<string | null>(null);

  const {
    list,
    department,
    location,
    time,

    items,
    onAddItem,
    onRemoveItem,
    onChangeItemField,

    amount,
    amountMode,
    onChangeAmountMode,
    onChangeAmount,

    showForm,
    formattedDate,

    setDepartment,
    setTime,
    setLocation,

    addButtonIntent,
    handleAddButtonClick,

    openForm,
    applyAiPrefill,

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

  const settle = useReservationSettleFlow({
    list,
    onComplete: handleComplete,
  });

  const canManageActions = !!role.canManageActions;
  const showAddButton = canManageActions && editingId === null;

  const prefillKey = useMemo(() => {
    if (!aiPrefill) return null;
    return toPrefillKey(aiPrefill);
  }, [aiPrefill]);

  useEffect(() => {
    if (!isReady) return;
    if (!aiPrefill) return;
    if (!prefillKey) return;

    if (appliedKeyRef.current === prefillKey) return;
    appliedKeyRef.current = prefillKey;

    openForm();

    applyAiPrefill({
      items: aiPrefill.parsedItems,
      department: aiPrefill.department ?? null,
      departmentMode: aiPrefill.departmentMode,
      selectedDepartmentId: aiPrefill.selectedDepartmentId ?? null,
      time: aiPrefill.time ?? null,
      location: aiPrefill.location ?? null,
      amount: aiPrefill.amount ?? null,
      memo: aiPrefill.memo ?? null,
    });
  }, [aiPrefill, applyAiPrefill, isReady, openForm, prefillKey]);

  if (!isReady) return null;

  return (
    <>
      <DayPageView
        header={{
          dateText: formattedDate,
          onBack: () => router.back(),
        }}
        list={{
          list,
          departments,
          departmentsLoading: !!departmentsLoading,
          onComplete: settle.onClickComplete,
          onCancel: handleCancel,
          onEdit: handleEdit,
          editingId,
          editForm,
          onChangeEditField: handleChangeEditField,
          onSubmitEdit: handleSubmitEdit,
          onCancelEdit: handleCancelEdit,
          canManageActions,
        }}
        showForm={showForm}
        form={
          showForm
            ? {
                department,
                location,
                time,

                items,
                onAddItem,
                onRemoveItem,
                onChangeItemField,

                amount,
                amountMode,
                onChangeAmountMode,
                onChangeAmount,

                onChangeDepartment: setDepartment,
                onChangeLocation: setLocation,
                onChangeTime: setTime,

                departmentMode,
                departments,
                selectedDepartmentId,
                departmentsLoading: !!departmentsLoading,
                onChangeDepartmentMode: setDepartmentMode,
                onChangeSelectedDepartmentId: setSelectedDepartmentId,
              }
            : undefined
        }
        showAddButton={showAddButton}
        addButton={{
          intent: addButtonIntent,
          onClick: handleAddButtonClick,
        }}
      />

      <ReservationDebtSettleConfirmSheet
        open={settle.settleOpen}
        onClose={settle.closeSettle}
        onConfirm={settle.confirmSettle}
        loading={settle.settleLoading}
      />
    </>
  );
}
