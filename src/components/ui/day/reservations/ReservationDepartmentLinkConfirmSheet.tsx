"use client";

import { useMemo, useState } from "react";
import { DEPARTMENT_LINK_CONFIRM_COPY } from "@/constants/departmentLinkConfirm";
import { DayUI } from "../DayUI";
import type { DepartmentLinkCandidate } from "@/hooks/reservation/internal/departments/resolveDepartmentLink";

type Props = {
  open: boolean;
  inputText: string;
  candidates: DepartmentLinkCandidate[];
  onClose: () => void;
  onConfirmLink: (departmentId: string) => void;
  onConfirmUnlink: () => void;
  loading?: boolean;
};

export function ReservationDepartmentLinkConfirmSheet({
  open,
  inputText,
  candidates,
  onClose,
  onConfirmLink,
  onConfirmUnlink,
  loading,
}: Props) {
  const hasCandidates = candidates.length > 0;

  const topId = useMemo(() => candidates[0]?.id ?? null, [candidates]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const resolvedSelectedId = selectedId ?? topId;
  const canLink = hasCandidates && !!resolvedSelectedId;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <DayUI.SheetOverlay onBackdropClick={onClose}>
        <DayUI.SheetContainer>
          <DayUI.SheetHeader>
            <div>
              <DayUI.SheetTitle>
                {DEPARTMENT_LINK_CONFIRM_COPY.title}
              </DayUI.SheetTitle>

              <DayUI.SheetDesc>
                {hasCandidates
                  ? DEPARTMENT_LINK_CONFIRM_COPY.body
                  : DEPARTMENT_LINK_CONFIRM_COPY.noCandidates}
              </DayUI.SheetDesc>

              <div className="mt-3 text-sm">
                <div className="opacity-70">입력: {inputText}</div>

                {hasCandidates ? (
                  <div className="mt-2">
                    <div className="mb-1 font-medium">
                      {DEPARTMENT_LINK_CONFIRM_COPY.candidatesTitle}
                    </div>

                    <ul className="space-y-1">
                      {candidates.map((c) => {
                        const active = (selectedId ?? topId) === c.id;

                        return (
                          <li key={c.id}>
                            <button
                              type="button"
                              className={[
                                "w-full text-left flex items-center justify-between gap-2 rounded-lg px-3 py-2",
                                active ? "bg-black/5" : "hover:bg-black/5",
                              ].join(" ")}
                              onClick={() => setSelectedId(c.id)}
                              disabled={loading}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{c.name}</span>
                                <span className="text-xs opacity-60">
                                  {c.reason === "exact"
                                    ? DEPARTMENT_LINK_CONFIRM_COPY.hintExact
                                    : DEPARTMENT_LINK_CONFIRM_COPY.hintIncludes}
                                </span>
                              </div>

                              <span className="text-xs opacity-60">
                                {active
                                  ? DEPARTMENT_LINK_CONFIRM_COPY.selected
                                  : ""}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <DayUI.SheetCloseButton onClick={onClose} disabled={loading}>
              {DEPARTMENT_LINK_CONFIRM_COPY.cancel}
            </DayUI.SheetCloseButton>
          </DayUI.SheetHeader>

          <DayUI.SheetFooter>
            <DayUI.SheetActionButton
              variant="secondary"
              onClick={onConfirmUnlink}
              disabled={loading}
            >
              {DEPARTMENT_LINK_CONFIRM_COPY.unlink}
            </DayUI.SheetActionButton>

            <DayUI.SheetActionButton
              variant="primary"
              onClick={() => {
                if (!resolvedSelectedId) return;
                onConfirmLink(resolvedSelectedId);
              }}
              disabled={loading || !canLink}
            >
              {loading
                ? DEPARTMENT_LINK_CONFIRM_COPY.loading
                : DEPARTMENT_LINK_CONFIRM_COPY.link}
            </DayUI.SheetActionButton>
          </DayUI.SheetFooter>
        </DayUI.SheetContainer>
      </DayUI.SheetOverlay>
    </div>
  );
}
