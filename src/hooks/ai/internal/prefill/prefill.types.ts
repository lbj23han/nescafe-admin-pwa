export type PrefillItem = {
  menu: string;
  quantity: string; // digits only, can be "" if unknown
  unitPrice?: string; // digits only (optional)
};

export type DayReservationPrefillQuery = {
  ai: "1";
  department?: string;
  departmentMode?: "select" | "direct";
  selectedDepartmentId?: string;
  time?: string;
  location?: string;
  amount?: string;
  items?: string; // JSON string of PrefillItem[]
  memo?: string;
};
