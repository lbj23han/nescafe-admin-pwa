"use client";

import { BottomNav } from "@/components/navigation/BottomNav";

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-14">
      {children}
      <BottomNav />
    </div>
  );
}
