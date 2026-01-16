"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "./DayUI";
import type { DayPageViewProps } from "./DayPage.types";
import { ReservationListSection, ReservationFormSection } from "./reservations";

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
            {addButton.showForm
              ? DAY_PAGE_COPY.buttons.submit
              : DAY_PAGE_COPY.buttons.add}
          </DayUI.PrimaryButton>
        )}
      </DayUI.Main>
    </DayUI.Layout>
  );
}
