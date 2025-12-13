// components/pages/day/DayDetailPageContainer.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Reservation } from "@/hooks/reservation";
import { DayPageUI as UI } from "@/components/ui/day/DayPage.view";

type Props = {
  date: string;
};

export function DayDetailPageContainer({ date }: Props) {
  const router = useRouter();
  const isReady = useAuthGuard();

  const {
    // 리스트 & 폼 상태
    list,
    department,
    menu,
    amount,
    time,
    location,
    showForm,
    formattedDate,
    // 폼 setter
    setDepartment,
    setMenu,
    setTime,
    setLocation,
    // 액션
    handleAmountChange,
    handleAddButtonClick,
    handleComplete,
    handleCancel,
    // ✅ 수정 관련 (useReservationStatus에서 온 것들)
    handleEdit,
    editingId,
    editForm,
    handleChangeEditField,
    handleSubmitEdit,
    handleCancelEdit,
  } = Reservation.useDay(date);

  if (!isReady) return null;

  return (
    <UI.Layout>
      <UI.Header dateText={formattedDate} onBack={() => router.back()} />
      <UI.Main>
        <UI.ReservationList
          list={list}
          onComplete={handleComplete}
          onCancel={handleCancel}
          // 수정 관련 props 연결
          onEdit={handleEdit}
          editingId={editingId}
          editForm={editForm}
          onChangeEditField={handleChangeEditField}
          onSubmitEdit={handleSubmitEdit}
          onCancelEdit={handleCancelEdit}
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
          />
        )}

        {editingId === null && (
          <UI.AddButton showForm={showForm} onClick={handleAddButtonClick} />
        )}
      </UI.Main>
    </UI.Layout>
  );
}
