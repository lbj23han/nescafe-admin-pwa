// hooks/useAuthGuard.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_LOCALSTORAGE_KEY } from "@/constants/auth";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const authed = localStorage.getItem(AUTH_LOCALSTORAGE_KEY) === "true";

    if (!authed) {
      router.replace("/");
    }
  }, [router]);

  // 항상 false 반환 → 페이지는 처음에 아무것도 렌더 안 함
  return (
    typeof window !== "undefined" &&
    localStorage.getItem(AUTH_LOCALSTORAGE_KEY) === "true"
  );
}
