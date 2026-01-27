export type AmountMode = "auto" | "manual";

export function digitsOnly(v: string) {
  return v.replace(/\D/g, "");
}

function toPosInt(v: string) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const out = Math.floor(n);
  return out > 0 ? out : null;
}

export function computeAutoAmount(quantity: string, unitPrice: string) {
  const q = toPosInt(quantity);
  const u = toPosInt(unitPrice);
  if (!q || !u) return null;
  return String(q * u);
}

export function resolveDisplayAmount(args: {
  mode: AmountMode;
  autoAmount: string | null;
  manualAmount: string;
}) {
  const { mode, autoAmount, manualAmount } = args;
  if (mode === "auto" && autoAmount !== null) return autoAmount;
  return manualAmount;
}

export function resolveFinalAmountNumber(args: {
  mode: AmountMode;
  autoAmount: string | null;
  manualAmount: string;
}) {
  const out =
    args.mode === "auto" && args.autoAmount !== null
      ? args.autoAmount
      : args.manualAmount;

  if (!out) return 0;
  return Number(out) || 0;
}
