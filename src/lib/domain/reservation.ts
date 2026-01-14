export type ReservationStatus = "pending" | "completed";

/**
 * 정산 타입
 * - 장부 연동 가능한 예약(= department_id가 있는 예약)을 completed 처리할 때만 의미가 생김
 * - direct input(비연동)은 settleType이 필요 없음
 */
export type SettlementType = "deposit" | "debt";

export type Reservation = {
  id: string;

  /**
   * 장부 연동용
   * - departments 테이블의 id
   * - direct input 예약이면 null/undefined
   */
  departmentId?: string | null;

  /**
   * UI 표시/직접입력/스냅샷용
   * - department_id가 생기면 이 값은 스냅샷/표시용으로 계속 활용
   */
  department: string;

  menu: string;

  amount?: number;

  time?: string;
  location?: string;

  status: ReservationStatus;

  memo?: string;

  /**
   * 완료 처리 시 결정되는 정산 타입
   * - pending: undefined/null 가능
   * - completed + (연동 예약): deposit|debt 필요 (task5에서 UI로 받음)
   */
  settleType?: SettlementType | null;
};
