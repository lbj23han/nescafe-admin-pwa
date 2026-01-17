"use client";

import { MainUI } from "./MainUI";
import type { MainPageViewProps } from "./MainPage.types";

export function MainPageView({
  title,
  description,
  children,
}: MainPageViewProps) {
  return (
    <MainUI.Layout>
      <MainUI.HeaderContainer>
        <MainUI.Title>{title}</MainUI.Title>
        <MainUI.Description>{description}</MainUI.Description>
      </MainUI.HeaderContainer>

      {children}
    </MainUI.Layout>
  );
}
