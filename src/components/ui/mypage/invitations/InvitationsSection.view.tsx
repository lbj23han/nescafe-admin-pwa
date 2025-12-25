"use client";

import type { InvitationRow } from "@/lib/contracts/invitations";
import type { InvitationsSectionViewProps } from "./InvitationsSection.types";
import { INVITATIONS_COPY as COPY } from "@/constants/mypage/invitations";

function canCancel(inv: InvitationRow) {
  return inv.status === "pending";
}

export function InvitationsSectionView({
  pending,
  accepted,
  loading,
  creating,
  error,
  lastCreated,
  email,
  onChangeEmail,
  onCreate,
  onCancel,
  onCopy,
  formatKST,
  pickAcceptedAt,
}: InvitationsSectionViewProps) {
  return (
    <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-800">{COPY.title}</h2>
        <span className="text-xs text-zinc-500">
          {COPY.pendingBadge(pending.length)}
        </span>
      </div>

      {/* create form */}
      <div className="rounded-lg border border-zinc-300 p-3">
        <div className="mb-2 text-xs font-medium text-zinc-700">
          {COPY.form.labelEmail}
        </div>

        <input
          className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-700 placeholder:text-zinc-400"
          placeholder={COPY.form.placeholderEmail}
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
        />

        <button
          className="mt-2 h-10 w-full rounded-md bg-black text-sm font-medium text-white disabled:opacity-50"
          onClick={onCreate}
          disabled={creating}
        >
          {creating ? COPY.form.creatingButton : COPY.form.createButton}
        </button>

        {lastCreated && (
          <div className="mt-3 rounded-md bg-zinc-50 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-zinc-500">
                  {COPY.lastCreated.label}
                </div>
                <div className="truncate font-mono text-zinc-700">
                  {lastCreated.inviteLink}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {COPY.lastCreated.expires}: {formatKST(lastCreated.expiresAt)}
                </div>
              </div>

              <button
                className="h-9 shrink-0 rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-700"
                onClick={() => onCopy(location.origin + lastCreated.inviteLink)}
              >
                {COPY.lastCreated.copyButton}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* lists */}
      <div className="mt-4">
        <div className="mb-2 text-xs text-zinc-700">
          {loading
            ? COPY.loading
            : COPY.summary(pending.length, accepted.length)}
        </div>

        {error && (
          <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* pending */}
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-700">
              {COPY.sections.pending}
            </h3>
            <span className="text-xs text-zinc-500">{pending.length}건</span>
          </div>

          {pending.length === 0 ? (
            <div className="rounded-md border border-zinc-100 p-3 text-sm text-zinc-500">
              {COPY.empty.pending}
            </div>
          ) : (
            <ul className="space-y-2">
              {pending.map((inv) => (
                <li
                  key={inv.id}
                  className="rounded-lg border border-zinc-100 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                          {inv.status}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-zinc-500">
                        {COPY.fields.email}:{" "}
                        <span className="text-zinc-700">{inv.email}</span>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {COPY.fields.created}:{" "}
                        <span className="text-zinc-700">
                          {formatKST(inv.created_at)}
                        </span>{" "}
                        / {COPY.fields.expires}:{" "}
                        <span className="text-zinc-700">
                          {formatKST(inv.expires_at)}
                        </span>
                      </div>
                    </div>

                    {canCancel(inv) && (
                      <button
                        className="
        h-9 shrink-0
        rounded-md border border-zinc-200
        bg-white px-3
        text-xs text-zinc-700
      "
                        onClick={() => onCancel(inv.id)}
                      >
                        {COPY.actions.cancel}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* accepted */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-700">
              {COPY.sections.accepted}
            </h3>
            <span className="text-xs text-zinc-500">{accepted.length}명</span>
          </div>

          {accepted.length === 0 ? (
            <div className="rounded-md border border-zinc-100 p-3 text-sm text-zinc-600">
              {COPY.empty.accepted}
            </div>
          ) : (
            <ul className="space-y-2">
              {accepted.map((inv) => {
                const acceptedAt = pickAcceptedAt(inv);
                return (
                  <li
                    key={inv.id}
                    className="rounded-lg border border-zinc-100 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                            accepted
                          </span>
                        </div>

                        <div className="mt-1 text-xs text-zinc-500">
                          {COPY.fields.email}:{" "}
                          <span className="text-zinc-700">{inv.email}</span>
                        </div>

                        <div className="mt-1 text-xs text-zinc-500">
                          {COPY.fields.accepted}:{" "}
                          <span className="text-zinc-700">
                            {formatKST(
                              acceptedAt ?? inv.updated_at ?? inv.created_at
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
