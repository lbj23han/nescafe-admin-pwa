"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { MainPageUI as UI } from "@/components/ui/main/MainPage.view";
import { MAIN_PAGE_COPY } from "@/constants/mainPage";
import { CalendarList } from "@/components/CalendarList";

export function MainPageContainer() {
  const isReady = useAuthGuard();
  const pathname = usePathname();

  // /main 진입 시 항상 스크롤 최상단
  useEffect(() => {
    if (!isReady) return;
    if (pathname !== "/main") return;

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [isReady, pathname]);

  if (!isReady) return null;

  return (
    <UI.Layout>
      <UI.Header
        title={MAIN_PAGE_COPY.title}
        description={MAIN_PAGE_COPY.description}
      />

      {/* 캘린더 영역 */}
      <CalendarList />
    </UI.Layout>
  );
}
