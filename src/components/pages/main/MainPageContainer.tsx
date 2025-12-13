// components/pages/main/MainPageContainer.tsx
"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { MainPageUI as UI } from "@/components/ui/main/MainPage.view";
import { MAIN_PAGE_COPY } from "@/constants/mainPage";
import { CalendarList } from "@/components/CalendarList";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useRouter } from "next/navigation"; // ✅ 추가

export function MainPageContainer() {
  const isReady = useAuthGuard();
  const router = useRouter(); // ✅ 추가

  if (!isReady) return null;

  // 장부관리 페이지로 이동
  const handleClickDepartment = () => {
    router.push("/departments");
  };

  return (
    <UI.Layout>
      <UI.Header
        title={MAIN_PAGE_COPY.title}
        description={MAIN_PAGE_COPY.description}
      />

      {/* 캘린더 영역 */}
      <CalendarList />

      {/* 하단 버튼 영역 */}
      <UI.Footer>
        {/*  장부관리 버튼 활성화 */}
        <PrimaryButton onClick={handleClickDepartment}>
          {MAIN_PAGE_COPY.buttons.department}
        </PrimaryButton>

        <PrimaryButton disabled>
          {MAIN_PAGE_COPY.buttons.aiHelper}
        </PrimaryButton>
      </UI.Footer>
    </UI.Layout>
  );
}
