"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { parseDayReservationPrefillQuery } from "@/hooks/ai/internal/prefill";

const DayDetailPageContainer = dynamic(
  () =>
    import("@/components/pages/day/DayDetailPageContainer").then(
      (m) => m.DayDetailPageContainer
    ),
  { ssr: false }
);

export default function DayDetailPage() {
  const params = useParams<{ date: string }>();
  const searchParams = useSearchParams();

  const date = params.date;
  if (!date) return null;

  const aiPrefill = searchParams
    ? parseDayReservationPrefillQuery(searchParams)
    : null;

  return <DayDetailPageContainer date={date} aiPrefill={aiPrefill} />;
}
