// components/ui/main/MainPage.view.tsx
"use client";

import { MainUI } from "./MainUI";
import { MAIN_PAGE_COPY } from "@/constants/mainPage";
import type { ReactNode } from "react";

export const MainPageUI = {
  Layout({ children }: { children: ReactNode }) {
    return <MainUI.Layout>{children}</MainUI.Layout>;
  },

  Header() {
    return (
      <MainUI.HeaderContainer>
        <MainUI.Title>{MAIN_PAGE_COPY.title}</MainUI.Title>
        <MainUI.Description>{MAIN_PAGE_COPY.description}</MainUI.Description>
      </MainUI.HeaderContainer>
    );
  },

  Footer({ children }: { children: ReactNode }) {
    return <MainUI.Footer>{children}</MainUI.Footer>;
  },
};
