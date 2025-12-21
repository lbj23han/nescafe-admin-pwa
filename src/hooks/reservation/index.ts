import { useReservationForm } from "./useReservationForm";
import { useReservationStatus } from "./useReservationStatus";
import { useDayReservation } from "./useDayReservation";

export const Reservation = {
  useForm: useReservationForm,
  useStatus: useReservationStatus,
  useDay: useDayReservation,
};
