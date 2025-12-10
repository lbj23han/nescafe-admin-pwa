// app/main/page.tsx
"use client";

import { CalendarList } from "@/components/CalendarList";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { MAIN_PAGE_COPY } from "@/constants/mainPage";
import { MainPageUI as UI } from "@/components/ui/mainPage";

export default function MainPage() {
  const isReady = useAuthGuard();

  // 인증 여부 확인 전/리다이렉트 중에는 아무것도 렌더하지 않음
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
