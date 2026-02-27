import { NextResponse } from "next/server";
import type { AiAssistantResponse } from "@/hooks/ai/internal/types";

export function json(status: number, body: AiAssistantResponse) {
  return NextResponse.json(body, { status });
}

export function safeTrim(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export function isIsoDate(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}
