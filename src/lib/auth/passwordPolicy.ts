export type PasswordPolicyResult = {
  valid: boolean;
  errors: string[];
};

export function validatePassword(password: string): PasswordPolicyResult {
  const errors: string[] = [];
  const v = password ?? "";

  if (v.length < 8) {
    errors.push("비밀번호는 8자 이상이어야 합니다.");
  }

  if (!/[A-Za-z]/.test(v)) {
    errors.push("영문을 1자 이상 포함해야 합니다.");
  }

  if (!/[0-9]/.test(v)) {
    errors.push("숫자를 1자 이상 포함해야 합니다.");
  }

  return { valid: errors.length === 0, errors };
}
