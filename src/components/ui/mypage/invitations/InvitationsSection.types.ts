import type {
  CreateInvitationResult,
  InvitationRow,
} from "@/lib/contracts/invitations";

export type InvitationsSectionViewProps = {
  // data
  pending: InvitationRow[];
  accepted: InvitationRow[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  lastCreated: CreateInvitationResult | null;

  // form
  email: string;
  onChangeEmail: (v: string) => void;
  onCreate: () => void;

  // actions
  onCancel: (invitationId: string) => void;
  onCopy: (text: string) => void;

  // utils
  formatKST: (iso: string) => string;
  pickAcceptedAt: (inv: InvitationRow) => string | null;
};
