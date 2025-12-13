// components/ui/main/MainPage.view.tsx
"use client";

import { MainUI } from "./MainUI";
import type { LayoutProps, HeaderProps, FooterProps } from "./MainPage.types";

export const MainPageUI = {
  Layout({ children }: LayoutProps) {
    return <MainUI.Layout>{children}</MainUI.Layout>;
  },

  Header({ title, description }: HeaderProps) {
    return (
      <MainUI.HeaderContainer>
        <MainUI.Title>{title}</MainUI.Title>
        <MainUI.Description>{description}</MainUI.Description>
      </MainUI.HeaderContainer>
    );
  },

  Footer({ children }: FooterProps) {
    return <MainUI.Footer>{children}</MainUI.Footer>;
  },
};
