"use client";

import { useState, type FormEvent } from "react";
import type { Department } from "@/lib/departmentStorage";
import { addHistory } from "@/lib/departmentStorage";
import type { DepartmentCardProps } from "./DepartmentCard.types";
import * as UI from "./DepartmentCard.view";
import {
  formatHistoryAmount,
  formatHistoryDate,
  formatHistoryType,
  isPositiveHistory,
} from "@/lib/departmentHistoryFormat";
import {
  DEPARTMENT_CARD_COPY,
  DEPARTMENT_HISTORY_LABEL,
} from "@/constants/department";

export function DepartmentCard({
  department,
  expanded,
  onToggle,
  onChange,
}: DepartmentCardProps) {
  const [historyType, setHistoryType] =
    useState<Parameters<typeof formatHistoryType>[0]>("deposit");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      alert("금액을 0보다 크게 입력해주세요.");
      return;
    }

    const updated = addHistory(department, historyType, parsed, memo);
    onChange(updated);
    setAmount("");
    setMemo("");
  };

  const hasHistory = department.history.length > 0;

  return (
    <UI.Root expanded={expanded} onClick={onToggle}>
      <UI.Header
        name={department.name}
        deposit={department.deposit}
        debt={department.debt}
        expanded={expanded}
        onToggleClick={onToggle}
      />

      {expanded && (
        <UI.ExpandedContainer>
          {/* 폼 */}
          <UI.FormContainer onSubmit={handleSubmit}>
            <UI.FormRow>
              <div className="flex-1">
                <UI.FieldLabel>{DEPARTMENT_CARD_COPY.field.type}</UI.FieldLabel>
                <UI.SelectField
                  value={historyType}
                  onChange={(e) =>
                    setHistoryType(e.target.value as typeof historyType)
                  }
                >
                  <option value="deposit">
                    {DEPARTMENT_HISTORY_LABEL.deposit}
                  </option>
                  <option value="order">
                    {DEPARTMENT_HISTORY_LABEL.payment}
                  </option>
                  <option value="debtPayment">
                    {DEPARTMENT_HISTORY_LABEL.debtPayment}
                  </option>
                </UI.SelectField>
              </div>

              <div className="w-28">
                <UI.FieldLabel>
                  {DEPARTMENT_CARD_COPY.field.amount}
                </UI.FieldLabel>
                <UI.AmountInput
                  type="number"
                  placeholder={DEPARTMENT_CARD_COPY.placeholder.amount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </UI.FormRow>

            <div>
              <UI.FieldLabel>{DEPARTMENT_CARD_COPY.field.memo}</UI.FieldLabel>
              <UI.MemoInput
                placeholder={DEPARTMENT_CARD_COPY.placeholder.memo}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>

            <UI.SubmitButton type="submit">기록 추가</UI.SubmitButton>
          </UI.FormContainer>

          {/* 히스토리 */}
          <UI.HistoryContainer>
            {!hasHistory && <UI.HistoryEmpty />}
            {hasHistory && (
              <UI.HistoryList
                items={department.history.slice().reverse()}
                renderItem={(h) => (
                  <UI.HistoryItem
                    key={h.id}
                    left={
                      <div>
                        <div className="font-medium text-zinc-700">
                          {formatHistoryType(h.type)}
                        </div>
                        {h.memo && (
                          <div className="text-zinc-600">{h.memo}</div>
                        )}
                        <div className="text-[10px] text-zinc-400">
                          {formatHistoryDate(h.date)}
                        </div>
                      </div>
                    }
                    right={
                      <div
                        className={`shrink-0 font-semibold ${
                          isPositiveHistory(h)
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatHistoryAmount(h)}
                      </div>
                    }
                  />
                )}
              />
            )}
          </UI.HistoryContainer>
        </UI.ExpandedContainer>
      )}
    </UI.Root>
  );
}
