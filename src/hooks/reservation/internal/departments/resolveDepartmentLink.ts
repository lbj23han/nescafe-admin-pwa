import type { Department } from "@/lib/storage/departments.local";

export type DepartmentLinkCandidate = {
  id: string;
  name: string;
  reason: "exact" | "includes";
  score: number; // higher is better
};

export type ResolveDepartmentLinkResult =
  | { kind: "unlinked" }
  | {
      kind: "confirm";
      inputText: string;
      candidates: DepartmentLinkCandidate[];
    };

function normalizeDepartmentName(v: string) {
  // 보수적: 공백/구분기호 제거 + 소문자
  return v
    .trim()
    .toLowerCase()
    .replace(/[\s\-_./()]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, ""); // 문자/숫자만
}

function scoreCandidate(inputNorm: string, deptName: string) {
  const deptNorm = normalizeDepartmentName(deptName);
  if (!deptNorm) return null;

  if (deptNorm === inputNorm) {
    return { reason: "exact" as const, score: 100 };
  }

  if (inputNorm.length >= 2 && deptNorm.length >= 2) {
    const aInB = deptNorm.includes(inputNorm);
    const bInA = inputNorm.includes(deptNorm);
    if (aInB || bInA) {
      // 더 가까운 포함 관계일수록 약간 점수 업
      const delta = Math.abs(deptNorm.length - inputNorm.length);
      return { reason: "includes" as const, score: 70 - Math.min(delta, 20) };
    }
  }

  return null;
}

export function resolveDepartmentLink(args: {
  inputText: string;
  departments: Department[];
  maxCandidates?: number;
}): ResolveDepartmentLinkResult {
  const { inputText, departments, maxCandidates = 3 } = args;

  const raw = inputText.trim();
  if (!raw) return { kind: "unlinked" };

  const inputNorm = normalizeDepartmentName(raw);
  if (!inputNorm) return { kind: "unlinked" };

  const candidates = departments
    .map((d) => {
      const scored = scoreCandidate(inputNorm, d.name);
      if (!scored) return null;
      return {
        id: d.id,
        name: d.name,
        reason: scored.reason,
        score: scored.score,
      } satisfies DepartmentLinkCandidate;
    })
    .filter((x): x is DepartmentLinkCandidate => !!x)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCandidates);

  if (candidates.length === 0) return { kind: "unlinked" };

  // 정책: direct 입력은 “자동 연동” 금지 → 매칭되면 무조건 confirm으로 보냄
  return { kind: "confirm", inputText: raw, candidates };
}
