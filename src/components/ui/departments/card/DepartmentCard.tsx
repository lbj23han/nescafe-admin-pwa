"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  addHistory,
  renameDepartment,
  updateHistory,
  HistoryType,
} from "@/lib/departmentStorage";
import type { DepartmentCardProps } from "./DepartmentCard.types";
import type { HistoryEditDraft } from "./DepartmentCard.types";
import * as UI from "./DepartmentCardUI";
import {
  formatHistoryAmount,
  formatHistoryDate,
  formatHistoryType,
  isPositiveHistory,
} from "@/lib/departmentHistoryFormat";
import {
  DEPARTMENT_CARD_COPY,
  DEPARTMENT_HISTORY_LABEL,
} from "@/constants/departments/card";

export function DepartmentCard({
  department,
  expanded,
  onToggle,
  onChange,
  onDelete,
}: DepartmentCardProps) {
  // ✅ 추가 폼 상태
  const [historyType, setHistoryType] =
    useState<Parameters<typeof formatHistoryType>[0]>("deposit");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  // ✅ 부서명 편집 상태
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(department.name);

  // ✅ 내역 편집 상태
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [historyDraft, setHistoryDraft] = useState<HistoryEditDraft>({
    type: "deposit",
    amount: "",
    memo: "",
  });

  // department가 바뀌었는데 편집중이면 draft 싱크가 꼬일 수 있어 최소 방어
  useMemo(() => {
    if (!editingName) setNameDraft(department.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department.name]);

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

  const handleDelete = () => {
    if (!onDelete) return;

    const ok = window.confirm("정말 부서를 삭제합니까?");
    if (!ok) return;

    onDelete(department.id);
  };

  // ✅ 부서명 저장
  const saveName = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      alert("부서명을 입력해주세요.");
      return;
    }

    const updated = renameDepartment(department, trimmed);
    onChange(updated);
    setEditingName(false);
  };

  // ✅ 내역 편집 시작
  const startEditHistory = (id: string) => {
    const target = department.history.find((h) => h.id === id);
    if (!target) return;

    setEditingHistoryId(id);
    setHistoryDraft({
      type: target.type,
      amount: String(target.amount ?? ""),
      memo: target.memo ?? "",
    });
  };

  const cancelEditHistory = () => {
    setEditingHistoryId(null);
  };

  const saveEditHistory = () => {
    if (!editingHistoryId) return;

    const parsed = Number(historyDraft.amount);
    if (!parsed || parsed <= 0) {
      alert("금액을 0보다 크게 입력해주세요.");
      return;
    }

    const updated = updateHistory(department, editingHistoryId, {
      type: historyDraft.type,
      amount: parsed,
      memo: historyDraft.memo,
    });

    onChange(updated);
    setEditingHistoryId(null);
  };

  const hasHistory = department.history.length > 0;
  const reversedHistory = department.history.slice().reverse();

  return (
    <UI.Root expanded={expanded} onClick={onToggle}>
      <UI.Header
        name={department.name}
        nameNode={
          editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="w-full max-w-[220px] rounded-md border border-zinc-300 px-2 py-1 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
              <UI.TinyButton
                variant="primary"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  saveName();
                }}
              >
                저장
              </UI.TinyButton>
            </div>
          ) : undefined
        }
        deposit={department.deposit}
        debt={department.debt}
        expanded={expanded}
        onToggleClick={onToggle}
        onDeleteClick={onDelete ? handleDelete : undefined}
        editingName={editingName}
        onEditNameToggleClick={() => {
          setEditingName((prev) => {
            const next = !prev;
            if (!next) setNameDraft(department.name);
            return next;
          });
        }}
      />

      {expanded && (
        <UI.ExpandedContainer>
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
                    {DEPARTMENT_HISTORY_LABEL.order}
                  </option>
                  <option value="debtPayment">
                    {DEPARTMENT_HISTORY_LABEL.debtPayment}
                  </option>
                  <option value="payment">
                    {DEPARTMENT_HISTORY_LABEL.payment}
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

            <UI.SubmitButton type="submit">
              {DEPARTMENT_CARD_COPY.submit}
            </UI.SubmitButton>
          </UI.FormContainer>

          <UI.HistoryContainer>
            {!hasHistory && <UI.HistoryEmpty />}

            {hasHistory && (
              <UI.HistoryList
                items={reversedHistory}
                renderItem={(h) => {
                  const editing = editingHistoryId === h.id;

                  if (!editing) {
                    return (
                      <UI.HistoryItemContent
                        key={h.id}
                        typeLabel={formatHistoryType(h.type)}
                        memo={h.memo}
                        dateLabel={formatHistoryDate(h.date)}
                        amountLabel={formatHistoryAmount(h)}
                        positive={isPositiveHistory(h)}
                        actions={
                          <UI.TinyButton
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditHistory(h.id);
                            }}
                          >
                            수정
                          </UI.TinyButton>
                        }
                      />
                    );
                  }

                  return (
                    <li
                      key={h.id}
                      className="rounded-md border border-zinc-200 bg-white p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <UI.FieldLabel>종류</UI.FieldLabel>
                          <UI.SelectField
                            value={historyDraft.type}
                            onChange={(e) =>
                              setHistoryDraft((prev) => ({
                                ...prev,
                                type: e.target.value as HistoryType,
                              }))
                            }
                          >
                            <option value="deposit">
                              {DEPARTMENT_HISTORY_LABEL.deposit}
                            </option>
                            <option value="order">
                              {DEPARTMENT_HISTORY_LABEL.order}
                            </option>
                            <option value="debtPayment">
                              {DEPARTMENT_HISTORY_LABEL.debtPayment}
                            </option>
                            <option value="payment">
                              {DEPARTMENT_HISTORY_LABEL.payment}
                            </option>
                          </UI.SelectField>
                        </div>

                        <div className="w-28">
                          <UI.FieldLabel>금액</UI.FieldLabel>
                          <UI.AmountInput
                            type="number"
                            value={historyDraft.amount}
                            onChange={(e) =>
                              setHistoryDraft((prev) => ({
                                ...prev,
                                amount: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <UI.FieldLabel>메모</UI.FieldLabel>
                        <UI.MemoInput
                          value={historyDraft.memo}
                          onChange={(e) =>
                            setHistoryDraft((prev) => ({
                              ...prev,
                              memo: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="mt-2 flex justify-end gap-2">
                        <UI.TinyButton
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEditHistory();
                          }}
                        >
                          취소
                        </UI.TinyButton>

                        <UI.TinyButton
                          variant="primary"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEditHistory();
                          }}
                        >
                          저장
                        </UI.TinyButton>
                      </div>
                    </li>
                  );
                }}
              />
            )}
          </UI.HistoryContainer>
        </UI.ExpandedContainer>
      )}
    </UI.Root>
  );
}
