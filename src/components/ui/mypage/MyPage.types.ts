import type { ReactNode, ButtonHTMLAttributes } from "react";

export type LayoutProps = { children: ReactNode };
export type HeaderProps = { title: string };
export type CardProps = { children: ReactNode };
export type RowProps = { label: string; value: string };
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
