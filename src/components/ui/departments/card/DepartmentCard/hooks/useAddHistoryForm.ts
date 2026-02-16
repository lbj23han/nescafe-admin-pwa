"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { DepartmentCardProps } from "../../DepartmentCard.types";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import { formatHistoryType } from "@/lib/departmentHistoryFormat";
import { DepartmentHistoryRepo } from "@/lib/data";
import type { HistoryType } from "@/lib/storage/departments.local";

export function useAddHistoryForm(
  p: Pick<DepartmentCardProps, "department" | "onChange" | "ledgerPrefill">
) {
  const [type, setType] =
    useState<Parameters<typeof formatHistoryType>[0]>("deposit");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  // 더블클릭/연타 방지
  const submittingRef = useRef(false);

  // 프리필 “같은 값” 연속 적용 방지
  const lastAppliedKeyRef = useRef<string>("");

  useEffect(() => {
    const pre = p.ledgerPrefill;
    if (!pre) return;
    if (pre.departmentId !== p.department.id) return;

    // 사용자가 이미 입력 중이면 덮어쓰지 않음
    if (amount.trim() || memo.trim()) return;

    const key = `${pre.departmentId}:${pre.type}:${pre.amount}`;
    if (lastAppliedKeyRef.current === key) return;

    // 타입은 localStorage enum과 맞춰야 함
    // 현재 DB constraint: deposit/order/debtPayment
    // UI에서도 동일하게 사용 가능
    setType(pre.type as HistoryType);
    setAmount(String(pre.amount));

    lastAppliedKeyRef.current = key;
  }, [p.ledgerPrefill, p.department.id, amount, memo]);

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
