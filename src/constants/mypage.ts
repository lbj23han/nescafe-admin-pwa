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
    logoutConfirmDialog: "로그아웃할까요?",
    openInvite: "직원 초대",
    closeInvite: "직원 초대 닫기",
    openAccount: "계정 설정",
    closeAccount: "계정 설정 닫기",
    deleteAccount: "회원탈퇴",
    deletingAccount: "탈퇴 처리 중…",
  },
  account: {
    title: "회원탈퇴 안내",
    bullets: [
      "계정의 가게/권한 정보가 제거됩니다.",
      "탈퇴 후 서비스 이용 및 접근이 제한됩니다.",
      "복구가 필요하면 관리자/운영을 통해 처리해야 합니다.",
    ],
    warningTitle: "주의: 탈퇴는 되돌릴 수 없습니다.",
    confirmHintPrefix: '아래 입력란에 "',
    confirmKeyword: "탈퇴",
    confirmHintSuffix: '" 를 입력해야 버튼이 활성화됩니다.',
    inputPlaceholder: "탈퇴",
    confirmDialog:
      "정말 탈퇴하시겠습니까?\n탈퇴 후에는 서비스 이용이 제한됩니다.",
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
  admin: "대표",
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
