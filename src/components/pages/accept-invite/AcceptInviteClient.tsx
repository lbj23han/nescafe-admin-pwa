"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { INVITE_ACCEPT_COPY } from "@/constants/invite";

type AcceptOk = { ok: true; redirectTo?: string };
type AcceptFail = { ok: false; code?: string; error?: string; detail?: string };
type AcceptResponse = AcceptOk | AcceptFail;

function parseJsonSafe(text: string): AcceptResponse | null {
  const t = (text ?? "").trim();
  if (!t) return null;
  try {
    return JSON.parse(t) as AcceptResponse;
  } catch {
    return null;
  }
}

export default function AcceptInviteClient({ token }: { token: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auto = (searchParams.get("auto") ?? "") === "1";

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string | null>(null);

  const triedRef = useRef(false);

  const onAccept = async () => {
    if (loading || done) return;

    setLoading(true);
    setError(null);
    setDebug(null);

    try {
      const res = await fetch(`/invite/${encodeURIComponent(token)}/accept`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // body 필요 없지만, 일부 환경에서 POST가 캐시/프리플라이트처럼 보이는걸 피하려면 넣어도 됨
        body: JSON.stringify({}),
      });

      const rawText = await res.text().catch(() => "");
      const parsed = parseJsonSafe(rawText);

      if (!res.ok) {
        const payload = (parsed ?? {}) as AcceptFail;
        const code = (payload.code ?? "").trim();

        const msgFromCode = code
          ? INVITE_ACCEPT_COPY.messagesByCode[code]
          : null;
        const message =
          msgFromCode ??
          payload.error ??
          (rawText.trim() ? rawText : INVITE_ACCEPT_COPY.fallbackError);

        setError(message);

        setDebug(
          [
            `status: ${res.status}`,
            code ? `code: ${code}` : null,
            payload.detail ? `detail: ${payload.detail}` : null,
            !parsed && rawText ? `raw: ${rawText}` : null,
          ]
            .filter(Boolean)
            .join("\n")
        );

        return;
      }

      // success
      const okPayload = (parsed ?? {}) as AcceptOk;
      setDone(true);

      const to =
        okPayload.redirectTo && okPayload.redirectTo.startsWith("/")
          ? okPayload.redirectTo
          : "/main";

      router.replace(to);
    } catch (e) {
      setError(INVITE_ACCEPT_COPY.unknownError);
      setDebug(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auto) return;
    if (triedRef.current) return;
    triedRef.current = true;
    onAccept();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  return (
    <div className="space-y-3">
      {auto && !done ? (
        <p className="text-sm text-zinc-600">
          {loading
            ? INVITE_ACCEPT_COPY.autoStatus.loading
            : INVITE_ACCEPT_COPY.autoStatus.preparing}
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600 whitespace-pre-wrap">{error}</p>
      ) : null}

      {debug ? (
        <details className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <summary className="cursor-pointer text-xs font-medium text-zinc-700">
            {INVITE_ACCEPT_COPY.debugTitle}
          </summary>
          <pre className="mt-2 whitespace-pre-wrap text-[11px] text-zinc-600">
            {debug}
          </pre>
        </details>
      ) : null}

      <button
        onClick={onAccept}
        disabled={loading || done}
        className="h-10 w-full rounded-md bg-black text-sm font-medium text-white disabled:opacity-60"
      >
        {loading
          ? INVITE_ACCEPT_COPY.buttons.loading
          : auto
          ? INVITE_ACCEPT_COPY.buttons.retry
          : INVITE_ACCEPT_COPY.buttons.accept}
      </button>
    </div>
  );
}
