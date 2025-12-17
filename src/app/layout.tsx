// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Cafe Ledger",
    template: "%s | Cafe Ledger",
  },
  description: "카페 예약 · 예치금 관리용 웹앱",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-zinc-50 text-black">
        <div className="min-h-screen flex items-center justify-center">
          <main className="w-full max-w-md min-h-screen bg-white shadow-sm pb-14">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
