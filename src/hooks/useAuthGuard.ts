"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type GuardProfileRow = {
  disabled_at: string | null;
};

export function useAuthGuard() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let alive = true;

    const goOut = (reason?: "disabled") => {
      if (reason === "disabled") router.replace("/?reason=disabled");
      else router.replace("/");
    };

    const check = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data.session;

      if (error || !session) {
        goOut();
        return;
      }

      // 여기서부터는 "무조건 통과"를 기본값으로, 빈 화면 방지
      if (alive) setAllowed(true);

      // disabled 계정만 막고 싶으면 아래만 유지
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("disabled_at")
        .eq("user_id", session.user.id)
        .maybeSingle<GuardProfileRow>();

      // 프로필 조회가 실패해도 앱을 죽이지 말고 "그냥 통과" (운영 안정성)
      if (pErr || !profile) return;

      if (profile.disabled_at) {
        try {
          await supabase.auth.signOut();
        } finally {
          goOut("disabled");
        }
      }
    };

    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (alive) setAllowed(false);
        goOut();
        return;
      }
      if (alive) setAllowed(true);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  return allowed;
}
