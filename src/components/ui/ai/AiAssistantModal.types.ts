import type { DepartmentLinkCandidate } from "@/hooks/reservation/internal/departments/resolveDepartmentLink";

export type AiAssistantScope = "reservation" | "ledger";

export type AiAssistantStep = "pickScope" | "input" | "preview";

export type AiAssistantDepartmentLink = {
  open: boolean;
  inputText: string;
  candidates: DepartmentLinkCandidate[];
};

export type PickScopeSectionProps = {
  linkOpen: boolean;
  onPickScope: (scope: AiAssistantScope) => void;
};

export type InputSectionProps = {
  linkOpen: boolean;
  scope: AiAssistantScope | null;
  input: string;
  inputPlaceholder: string;
  helperText: string;
  errorText: string | null;
  loading: boolean;
  onBack: () => void;
  onChangeInput: (v: string) => void;
  onRequestPreview: () => void;
};

export type PreviewSectionProps = {
  linkOpen: boolean;
  previewText: string | null;
  noticeText?: string | null;
  onEdit: () => void;
  onConfirm: () => void;
};

export type AiAssistantModalUIProps = {
  open: boolean;
  loading: boolean;
  title: string;
  subtitle: string;

  step: AiAssistantStep;
  scope: AiAssistantScope | null;

  input: string;
  inputPlaceholder: string;
  helperText: string;

  errorText: string | null;
  previewText: string | null;

  noticeText?: string | null;

  departmentLink?: AiAssistantDepartmentLink;
  onCloseDepartmentLink?: () => void;
  onConfirmDepartmentLink?: (departmentId: string) => void;
  onConfirmDepartmentUnlink?: () => void;

  onClose: () => void;
  onBack: () => void;

  onPickScope: (scope: AiAssistantScope) => void;
  onChangeInput: (v: string) => void;

  onRequestPreview: () => void;
  onEdit: () => void;
  onConfirm: () => void;
};
