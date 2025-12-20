"use client";

import type { ReactNode } from "react";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import type {
  ExpandedContainerProps,
  FormProps,
} from "../../DepartmentCard.types";

export function ExpandedContainer({ children }: ExpandedContainerProps) {
  return (
    <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}

export function FormContainer({ children, ...formProps }: FormProps) {
  const { className, ...rest } = formProps;

  return (
    <form
      {...rest}
      className={`p-3 border border-zinc-100 rounded-lg bg-zinc-50 space-y-3 ${
        className ?? ""
      }`}
    >
      <p className="text-[11px] font-semibold text-zinc-700">
        {DEPARTMENT_CARD_COPY.formTitle}
      </p>
      {children}
    </form>
  );
}

export function FormRow({ children }: { children: ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1 block text-[11px] text-zinc-500">{children}</label>
  );
}
