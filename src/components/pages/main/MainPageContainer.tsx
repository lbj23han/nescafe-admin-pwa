// components/pages/main/MainPageContainer.tsx
"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { MainPageUI as UI } from "@/components/ui/main/MainPage.view";
import { MAIN_PAGE_COPY } from "@/constants/mainPage";
import { CalendarList } from "@/components/CalendarList";
import { PrimaryButton } from "@/components/PrimaryButton";

export function MainPageContainer() {
  const isReady = useAuthGuard();

  // 인증 확인 전에는 렌더하지 않음
  if (!isReady) return null;

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
        <PrimaryButton disabled>
          {MAIN_PAGE_COPY.buttons.department}
        </PrimaryButton>
        <PrimaryButton disabled>
          {MAIN_PAGE_COPY.buttons.aiHelper}
        </PrimaryButton>
      </UI.Footer>
    </UI.Layout>
  );
}
