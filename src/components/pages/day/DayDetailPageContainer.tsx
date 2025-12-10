// components/pages/day/DayDetailPageContainer.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useDayReservation } from "@/hooks/useDayReservation";
import { DayPageUI as UI } from "@/components/ui/dayPage";

type Props = {
  date: string;
};

export function DayDetailPageContainer({ date }: Props) {
  const router = useRouter();
  const isReady = useAuthGuard();

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
  } = useDayReservation(date);

  // ✅ 여기서는 어떤 렌더에서도
  // useRouter → useAuthGuard → useDayReservation
  // 이 순서로 항상 호출되기 때문에 hook 규칙 위반 없음
  if (!isReady) return null;

  return (
    <UI.Layout>
      <UI.Header dateText={formattedDate} onBack={() => router.back()} />
      <UI.Main>
        <UI.ReservationList
          list={list}
          onComplete={handleComplete}
          onCancel={handleCancel}
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

        <UI.AddButton showForm={showForm} onClick={handleAddButtonClick} />
      </UI.Main>
    </UI.Layout>
  );
}
