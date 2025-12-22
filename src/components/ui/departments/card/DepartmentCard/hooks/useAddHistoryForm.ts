"use client";

import { useState, type FormEvent, useRef } from "react";
import type { DepartmentCardProps } from "../../DepartmentCard.types";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import { formatHistoryType } from "@/lib/departmentHistoryFormat";
import { DepartmentHistoryRepo } from "@/lib/data";
import type { HistoryType } from "@/lib/storage/departments.local";

export function useAddHistoryForm(
  p: Pick<DepartmentCardProps, "department" | "onChange">
) {
  const [type, setType] =
    useState<Parameters<typeof formatHistoryType>[0]>("deposit");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  // 더블클릭/연타 방지
  const submittingRef = useRef(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (submittingRef.current) return;

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      alert(DEPARTMENT_CARD_COPY.dialog.alert.amountMustBePositive);
      return;
    }

    try {
      submittingRef.current = true;
      setLoading(true);

      const res = await DepartmentHistoryRepo.addDepartmentHistory({
        departmentId: p.department.id,
        type: type as HistoryType,
        amount: parsed,
        memo,
      });

      // repo가 리턴한 “정합성 확정값(next)”으로 Department를 갱신
      p.onChange({
        ...p.department,
        deposit: res.next.deposit,
        debt: res.next.debt,
        history: res.next.history,
      });

      setAmount("");
      setMemo("");
    } catch (err) {
      console.error(err);
      alert("내역 저장에 실패했습니다.");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return {
    value: { type, amount, memo },
    setValue: { setType, setAmount, setMemo },
    submit,
    loading,
  };
}
