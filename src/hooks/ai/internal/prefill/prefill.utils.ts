export function safeParam(v: string | null | undefined): string | undefined {
  if (!v) return undefined;
  const t = v.trim();
  return t ? t : undefined;
}

export function digitsOnly(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const out = v.replace(/[^\d]/g, "");
  return out ? out : undefined;
}

export function toDigitsFromNumber(v: number | null): string | undefined {
  if (v === null) return undefined;
  if (!Number.isFinite(v)) return undefined;
  const n = Math.floor(v);
  if (n <= 0) return undefined;
  return String(n);
}
