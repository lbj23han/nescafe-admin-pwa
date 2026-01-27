"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Reservation } from "@/hooks/reservation";
import { DayPageView } from "@/components/ui/day/DayPage.view";
import { ReservationDebtSettleConfirmSheet } from "@/components/ui/day/reservations";
import { useMyRoleKey } from "@/components/ui/day/hooks/useMyRoleKey";
import { useReservationSettleFlow } from "@/components/ui/day/hooks/useReservationSettleFlow";

type Props = {
  date: string;
};

export function DayDetailPageContainer({ date }: Props) {
  const router = useRouter();
  const isReady = useAuthGuard();

  const role = useMyRoleKey(isReady);

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

  if (!isReady) return null;

  const canManageActions = !!role.canManageActions;
  const showAddButton = canManageActions && editingId === null;

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
