"use client";

import { useState, type FormEvent } from "react";
import { addHistory } from "@/lib/storage/departments.local";
import type { DepartmentCardProps } from "../../DepartmentCard.types";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import { formatHistoryType } from "@/lib/departmentHistoryFormat";

export function useAddHistoryForm(
  p: Pick<DepartmentCardProps, "department" | "onChange">
) {
  const [type, setType] =
    useState<Parameters<typeof formatHistoryType>[0]>("deposit");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      alert(DEPARTMENT_CARD_COPY.dialog.alert.amountMustBePositive);
      return;
    }

    p.onChange(addHistory(p.department, type, parsed, memo));
    setAmount("");
    setMemo("");
  };

  return {
    value: { type, amount, memo },
    setValue: { setType, setAmount, setMemo },
    submit,
  };
}
