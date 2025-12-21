import type { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export type MainProps = {
  children: ReactNode;
};

export type FooterProps = {
  year: number;
  appName: string;
};
