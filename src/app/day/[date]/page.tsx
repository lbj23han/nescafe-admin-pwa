// app/day/[date]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { DayDetailPageContainer } from "@/components/pages/day/DayDetailPageContainer";

export default function DayDetailPage() {
  const params = useParams<{ date: string }>();
  const date = params.date;

  // 여기서는 hook 하나만 쓰고, date 없으면 바로 종료
  if (!date) return null;

  // 실제 화면은 전부 컨테이너에 위임
  return <DayDetailPageContainer date={date} />;
}
