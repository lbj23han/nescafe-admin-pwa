"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  addHistory,
  renameDepartment,
  updateHistory,
  type HistoryType,
} from "@/lib/departmentStorage";
import type {
  DepartmentCardProps,
  HistoryEditDraft,
} from "./DepartmentCard.types";
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
  const [historyType, setHistoryType] =
    useState<Parameters<typeof formatHistoryType>[0]>("deposit");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(department.name);

  // ✅ 패턴 A: 내역 편집 모드
  const [historyEditMode, setHistoryEditMode] = useState(false);

  // ✅ 단일 row 편집
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [historyDraft, setHistoryDraft] = useState<HistoryEditDraft>({
    type: "deposit",
    amount: "",
    memo: "",
  });

  useMemo(() => {
    if (!editingName) setNameDraft(department.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department.name]);

  // ✅ 카드 접힘 시 상태 정리
  useEffect(() => {
    if (!expanded) {
      setHistoryEditMode(false);
      setEditingHistoryId(null);
      setEditingName(false);
      setNameDraft(department.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  // ---------------------------
  // ✅ 저장 안함 경고(dirty 체크)
  // ---------------------------
  const trimmedNameDraft = nameDraft.trim();
  const nameDirty =
    editingName &&
    trimmedNameDraft.length > 0 &&
    trimmedNameDraft !== department.name;

  const editingHistoryOriginal = useMemo(() => {
    if (!editingHistoryId) return null;
    return department.history.find((h) => h.id === editingHistoryId) ?? null;
  }, [department.history, editingHistoryId]);

  const historyDirty = useMemo(() => {
    if (!editingHistoryId || !editingHistoryOriginal) return false;

    const draftAmount = Number(historyDraft.amount);
    const originAmount = Number(editingHistoryOriginal.amount);

    const draftMemo = (historyDraft.memo ?? "").trim();
    const originMemo = (editingHistoryOriginal.memo ?? "").trim();

    return (
      historyDraft.type !== editingHistoryOriginal.type ||
      (Number.isFinite(draftAmount) ? draftAmount : NaN) !== originAmount ||
      draftMemo !== originMemo
    );
  }, [editingHistoryId, editingHistoryOriginal, historyDraft]);

  const confirmDiscardIfDirty = () => {
    if (!nameDirty && !historyDirty) return true;
    return window.confirm(DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose);
  };

  const guardedToggle = () => {
    // 펼친 상태에서 접히려 할 때만 확인
    if (expanded) {
      const ok = confirmDiscardIfDirty();
      if (!ok) return;
    }
    onToggle();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      alert(DEPARTMENT_CARD_COPY.dialog.alert.amountMustBePositive);
      return;
    }

    const updated = addHistory(department, historyType, parsed, memo);
    onChange(updated);
    setAmount("");
    setMemo("");
  };

  const handleDelete = () => {
    if (!onDelete) return;
    const ok = window.confirm(
      DEPARTMENT_CARD_COPY.dialog.confirm.deleteDepartment
    );
    if (!ok) return;
    onDelete(department.id);
  };

  const saveName = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      alert(DEPARTMENT_CARD_COPY.dialog.alert.nameRequired);
      return;
    }
    onChange(renameDepartment(department, trimmed));
    setEditingName(false);
  };

  const startEditHistory = (id: string) => {
    // 다른 row로 넘어가기 전에 dirty면 경고
    if (editingHistoryId && editingHistoryId !== id) {
      if (historyDirty) {
        const ok = window.confirm(
          DEPARTMENT_CARD_COPY.dialog.confirm.discardOnSwitchHistory
        );
        if (!ok) return;
      }
    }

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
    // 취소 시에도 dirty면 경고(안전장치)
    if (historyDirty) {
      const ok = window.confirm(
        DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose
      );
      if (!ok) return;
    }
    setEditingHistoryId(null);
  };

  const saveEditHistory = () => {
    if (!editingHistoryId) return;

    const parsed = Number(historyDraft.amount);
    if (!parsed || parsed <= 0) {
      alert(DEPARTMENT_CARD_COPY.dialog.alert.amountMustBePositive);
      return;
    }

    onChange(
      updateHistory(department, editingHistoryId, {
        type: historyDraft.type,
        amount: parsed,
        memo: historyDraft.memo,
      })
    );

    setEditingHistoryId(null);
  };

  const hasHistory = department.history.length > 0;
  const reversedHistory = department.history.slice().reverse();

  return (
    <UI.Root expanded={expanded} onClick={guardedToggle}>
      <UI.Header
        name={department.name}
        nameNode={
          expanded && editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="w-full max-w-[220px] rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-900 placeholder:text-zinc-500"
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
                {DEPARTMENT_CARD_COPY.headerAction.save}
              </UI.TinyButton>
            </div>
          ) : undefined
        }
        deposit={department.deposit}
        debt={department.debt}
        expanded={expanded}
        onToggleClick={guardedToggle}
        onDeleteClick={expanded && onDelete ? handleDelete : undefined}
        editingName={expanded ? editingName : false}
        onEditNameToggleClick={
          expanded
            ? () => {
                // 이름 편집을 끄려는데 dirty면 경고
                if (editingName && nameDirty) {
                  const ok = window.confirm(
                    DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose
                  );
                  if (!ok) return;
                }
                setEditingName((prev) => {
                  const next = !prev;
                  if (!next) setNameDraft(department.name);
                  return next;
                });
              }
            : undefined
        }
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

          <UI.HistoryContainer
            editMode={historyEditMode}
            stickyHeader
            actions={
              hasHistory ? (
                <UI.TinyButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    // 편집모드 끄려는데 row 편집중 + dirty면 경고
                    if (historyEditMode && editingHistoryId && historyDirty) {
                      const ok = window.confirm(
                        DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose
                      );
                      if (!ok) return;
                    }

                    setHistoryEditMode((prev) => !prev);
                    setEditingHistoryId(null);
                  }}
                >
                  {historyEditMode
                    ? DEPARTMENT_CARD_COPY.historyEdit.toggleOff
                    : DEPARTMENT_CARD_COPY.historyEdit.toggleOn}
                </UI.TinyButton>
              ) : undefined
            }
          >
            {!hasHistory && <UI.HistoryEmpty />}

            {hasHistory && (
              <UI.HistoryList
                items={reversedHistory}
                renderItem={(h) => {
                  const editing = editingHistoryId === h.id;

                  // ✅ 보기 모드 row
                  if (!editing) {
                    return (
                      <div
                        key={h.id}
                        className={[
                          "rounded-md px-2 py-1",
                          historyEditMode ? "hover:bg-zinc-50" : "",
                        ].join(" ")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <UI.HistoryItemContent
                          typeLabel={formatHistoryType(h.type)}
                          memo={h.memo}
                          dateLabel={formatHistoryDate(h.date)}
                          amountLabel={formatHistoryAmount(h)}
                          positive={isPositiveHistory(h)}
                          actions={
                            historyEditMode ? (
                              <UI.TinyButton
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditHistory(h.id);
                                }}
                                aria-label={
                                  DEPARTMENT_CARD_COPY.historyEdit
                                    .editActionAria
                                }
                                title={
                                  DEPARTMENT_CARD_COPY.historyEdit
                                    .editActionTitle
                                }
                              >
                                {
                                  DEPARTMENT_CARD_COPY.historyEdit
                                    .editActionIcon
                                }
                              </UI.TinyButton>
                            ) : undefined
                          }
                        />
                      </div>
                    );
                  }

                  // ✅ 편집 중 row 하이라이트 (ring + bg)
                  return (
                    <li
                      key={h.id}
                      className="rounded-md border border-zinc-300 bg-white p-2 ring-2 ring-zinc-300/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <UI.FieldLabel>
                            {DEPARTMENT_CARD_COPY.historyEditRow.label.type}
                          </UI.FieldLabel>
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
                          <UI.FieldLabel>
                            {DEPARTMENT_CARD_COPY.historyEditRow.label.amount}
                          </UI.FieldLabel>
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
                        <UI.FieldLabel>
                          {DEPARTMENT_CARD_COPY.historyEditRow.label.memo}
                        </UI.FieldLabel>
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
                          {DEPARTMENT_CARD_COPY.historyEditRow.button.cancel}
                        </UI.TinyButton>

                        <UI.TinyButton
                          variant="primary"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEditHistory();
                          }}
                        >
                          {DEPARTMENT_CARD_COPY.historyEditRow.button.save}
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
