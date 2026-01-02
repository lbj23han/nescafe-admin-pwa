"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { MainPageView } from "@/components/ui/main/MainPage.view";
import { MAIN_PAGE_COPY } from "@/constants/mainPage";
import { CalendarList } from "@/components/CalendarList";

export function MainPageContainer() {
  const isReady = useAuthGuard();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) return;
    if (pathname !== "/main") return;

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [isReady, pathname]);

  if (!isReady) return null;

  return (
    <MainPageView
      title={MAIN_PAGE_COPY.title}
      description={MAIN_PAGE_COPY.description}
    >
      <CalendarList />
    </MainPageView>
  );
}
