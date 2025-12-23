export const MYPAGE_COPY = {
  title: "마이페이지",
  fallback: {
    shopName: "미설정",
    position: "미설정",
    role: "알 수 없음",
  },
  labels: {
    shopName: "가게명",
    position: "직책",
    role: "권한",
  },
  actions: {
    logout: "로그아웃",
  },
} as const;

export const ROLE_LABEL: Record<string, string> = {
  owner: "대표",
  admin: "관리자",
  staff: "직원",
  viewer: "조회 전용",
  readonly: "조회 전용",
} as const;

export function getRoleLabel(role: unknown) {
  const key = String(role ?? "")
    .trim()
    .toLowerCase();

  // 디버깅 편하게: 예상 못한 role이면 값 노출
  return ROLE_LABEL[key] ?? `${MYPAGE_COPY.fallback.role} (${key || "empty"})`;
}

export const POSITION_LABEL: Record<string, string> = {
  owner: "대표",
  admin: "관리자",
  staff: "직원",
  viewer: "직원",
  readonly: "직원",
} as const;

export function getPositionLabel(role: unknown) {
  const key = String(role ?? "")
    .trim()
    .toLowerCase();
  return POSITION_LABEL[key] ?? MYPAGE_COPY.fallback.position;
}
