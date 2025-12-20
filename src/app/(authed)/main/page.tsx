"use client";

import dynamic from "next/dynamic";

const MainPageContainer = dynamic(
  () =>
    import("@/components/pages/main/MainPageContainer").then(
      (m) => m.MainPageContainer
    ),
  { ssr: false }
);

export default function MainPage() {
  return <MainPageContainer />;
}
