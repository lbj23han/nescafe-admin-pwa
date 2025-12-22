export type ReservationStatus = "pending" | "completed";

export type Reservation = {
  id: string;

  // UI 호환용 (서버는 department_id를 쓸 수 있지만 당장은 name 기반)
  department: string;

  menu: string;

  amount?: number;

  time?: string;
  location?: string;

  status: ReservationStatus;

  memo?: string;
};
