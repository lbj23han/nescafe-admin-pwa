"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "./DayUI";
import type { DayPageViewProps, AddButtonIntent } from "./DayPage.types";
import { ReservationListSection, ReservationFormSection } from "./reservations";

const ADD_BUTTON_LABEL: Record<AddButtonIntent, string> = {
  open: DAY_PAGE_COPY.buttons.add,
  close: DAY_PAGE_COPY.buttons.close,
  submit: DAY_PAGE_COPY.buttons.submit,
};

export function DayPageView(props: DayPageViewProps) {
  const { header, list, showForm, form, showAddButton, addButton } = props;

  return (
    <DayUI.Layout>
      <DayUI.Header
        backLabel={DAY_PAGE_COPY.backButton}
        title={DAY_PAGE_COPY.title}
        dateText={header.dateText}
        onBack={header.onBack}
      />

      <DayUI.Main>
        <ReservationListSection {...list} />

        {showForm && form && <ReservationFormSection {...form} />}

        {showAddButton && (
          <DayUI.PrimaryButton onClick={addButton.onClick}>
            {ADD_BUTTON_LABEL[addButton.intent]}
          </DayUI.PrimaryButton>
        )}
      </DayUI.Main>
    </DayUI.Layout>
  );
}
