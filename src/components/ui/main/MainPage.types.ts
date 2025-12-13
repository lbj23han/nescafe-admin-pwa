// components/ui/main/MainPage.types.ts
import type { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export type HeaderProps = {
  title: string;
  description: string;
};

export type FooterProps = {
  children: ReactNode;
};
