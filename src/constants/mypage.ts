export const MYPAGE_COPY = {
  title: "마이페이지",
  subtitle: "내 정보 조회 및 계정 관리",
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
    openInvite: "직원 초대",
    closeInvite: "직원 초대 닫기",
  },
} as const;

export function normalizeRole(role: unknown) {
  return String(role ?? "")
    .trim()
    .toLowerCase();
}

export function canInviteByRole(role: unknown) {
  const key = normalizeRole(role);
  return key === "owner" || key === "admin";
}

export const ROLE_LABEL: Record<string, string> = {
  owner: "대표",
  admin: "관리자",
  staff: "직원",
  viewer: "조회 전용",
  readonly: "조회 전용",
} as const;

export function getRoleLabel(role: unknown) {
  const key = normalizeRole(role);
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
  const key = normalizeRole(role);
  return POSITION_LABEL[key] ?? MYPAGE_COPY.fallback.position;
}

export function getShopNameText(args: {
  shopName: string | null;
  shopId: string | null;
}) {
  const name = args.shopName?.trim();
  if (name) return name;
  if (args.shopId) return `shop: ${args.shopId}`;
  return MYPAGE_COPY.fallback.shopName;
}
