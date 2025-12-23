"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  readHolidayCache,
  writeHolidayCache,
  type HolidayMap,
} from "./holidayCache";

function isRecordOfStrings(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  for (const [, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v !== "string") return false;
  }
  return true;
}

async function fetchHolidayJson(url: string): Promise<HolidayMap> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch: ${url} (${res.status})`);

  const data = (await res.json()) as unknown;
  if (!isRecordOfStrings(data)) throw new Error(`Invalid holiday JSON: ${url}`);

  return data;
}

const REMOTE_BASE =
  "https://raw.githubusercontent.com/lbj23han/nescafe-admin-pwa-holidays/main";

type Params = {
  years: number[]; // ex) [2025, 2026]
};

export function useHolidayMap({ years }: Params) {
  const normalizedYears = useMemo(() => {
    const uniq = Array.from(new Set(years)).filter(Boolean);
    uniq.sort((a, b) => a - b);
    return uniq;
  }, [years]);

  // 배열 의존성 대신 안정적인 key 사용
  const yearsKey = useMemo(() => normalizedYears.join(","), [normalizedYears]);

  // 동일 key로는 effect를 중복 실행하지 않게 막아줌 (dev StrictMode 포함)
  const ranKeyRef = useRef<string>("");

  //  1) 초기: 캐시를 즉시 합쳐서(동기) 먼저 보여줌
  const [holidayMap, setHolidayMap] = useState<HolidayMap>(() => {
    if (typeof window === "undefined") return {};
    const merged: HolidayMap = {};
    for (const y of normalizedYears) {
      const cached = readHolidayCache(y);
      if (cached) Object.assign(merged, cached);
    }
    return merged;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (normalizedYears.length === 0) return;

      // 같은 yearsKey로는 다시 실행하지 않음 (루프방지)
      if (ranKeyRef.current === yearsKey) return;
      ranKeyRef.current = yearsKey;

      setLoading(true);

      try {
        // 2) public 폴백 로드: /holidays/{year}.json
        // 3) 온라인이면 remote(GitHub raw)로 최신 덮어쓰기 + 캐시 저장
        await Promise.all(
          normalizedYears.map(async (year) => {
            // (a) local/public 폴백
            try {
              const local = await fetchHolidayJson(`/holidays/${year}.json`);
              if (!cancelled) {
                setHolidayMap((prev) => ({ ...prev, ...local }));
              }
              // 폴백도 캐시에 저장 -> 오프라인 첫 렌더가 더 안정적
              writeHolidayCache(year, local);
            } catch {
              // local 파일이 없으면 그냥 스킵
            }

            // (b) remote overwrite
            if (typeof navigator !== "undefined" && navigator.onLine) {
              try {
                const remote = await fetchHolidayJson(
                  `${REMOTE_BASE}/${year}.json`
                );
                if (!cancelled) {
                  setHolidayMap((prev) => ({ ...prev, ...remote }));
                }
                writeHolidayCache(year, remote);
              } catch {
                // remote 실패하면 조용히 폴백 유지
              }
            }
          })
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
    // normalizedYears(배열) 대신 yearsKey(문자열)만 의존성으로
  }, [yearsKey]);

  return { holidayMap, loading };
}
