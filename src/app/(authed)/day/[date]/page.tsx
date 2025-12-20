"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const DayDetailPageContainer = dynamic(
  () =>
    import("@/components/pages/day/DayDetailPageContainer").then(
      (m) => m.DayDetailPageContainer
    ),
  { ssr: false }
);

export default function DayDetailPage() {
  const params = useParams<{ date: string }>();
  const date = params.date;

  if (!date) return null;

  return <DayDetailPageContainer date={date} />;
}
