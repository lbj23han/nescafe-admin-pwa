export function safePositiveInt(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  const i = Math.floor(v);
  return i > 0 ? i : null;
}
