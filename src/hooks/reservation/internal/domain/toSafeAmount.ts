export function toSafeAmount(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;

  const out = Math.floor(n);
  return out > 0 ? out : null;
}
