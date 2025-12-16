"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "./DayUI";
import type {
  HeaderProps,
  ReservationListProps,
  ReservationFormProps,
  AddButtonProps,
  LayoutProps,
  MainProps,
} from "./DayPage.types";
import { ReservationListSection } from "./ReservationListSection";
import { ReservationFormSection } from "./ReservationFormSection";

export const DayPageUI = {
  Layout({ children }: LayoutProps) {
    return <DayUI.Layout>{children}</DayUI.Layout>;
  },

  Header({ dateText, onBack }: HeaderProps) {
    return (
      <DayUI.Header
        backLabel={DAY_PAGE_COPY.backButton}
        title={DAY_PAGE_COPY.title}
        dateText={dateText}
        onBack={onBack}
      />
    );
  },

  Main({ children }: MainProps) {
    return <DayUI.Main>{children}</DayUI.Main>;
  },

  ReservationList(props: ReservationListProps) {
    return <ReservationListSection {...props} />;
  },

  ReservationForm(props: ReservationFormProps) {
    return <ReservationFormSection {...props} />;
  },

  AddButton({ showForm, onClick }: AddButtonProps) {
    return (
      <DayUI.PrimaryButton onClick={onClick}>
        {showForm ? DAY_PAGE_COPY.buttons.submit : DAY_PAGE_COPY.buttons.add}
      </DayUI.PrimaryButton>
    );
  },
};
