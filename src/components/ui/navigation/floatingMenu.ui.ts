export const FLOATING_MENU_UI = {
  fab:
    "inline-flex h-14 w-14 items-center justify-center rounded-full " +
    "bg-amber-50 text-zinc-900 border border-zinc-300 shadow-lg " +
    "active:scale-[0.98] " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",

  overlay:
    "fixed inset-0 z-[70] bg-black/35 backdrop-blur-[1px] " +
    "data-[state=open]:animate-in data-[state=open]:fade-in " +
    "data-[state=closed]:animate-out data-[state=closed]:fade-out",

  modal:
    "fixed left-1/2 top-1/2 z-[70] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 " +
    "rounded-2xl bg-white shadow-2xl border border-zinc-200 " +
    "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in " +
    "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out",

  modalInner: "p-4",

  header: "flex items-start justify-between gap-3",
  titleWrap: "min-w-0",
  title: "text-base font-semibold text-zinc-900",
  subtitle: "mt-1 text-xs text-zinc-600",
  closeBtn:
    "shrink-0 rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200",

  section: "mt-4",
  sectionTitle: "text-xs font-medium text-zinc-500",
  grid: "mt-2 flex flex-col gap-2",

  cardBtn:
    "rounded-xl border border-zinc-200 bg-white p-3 text-left " +
    "hover:bg-zinc-50 active:bg-zinc-100",

  cardTitle: "text-sm font-semibold text-zinc-900",
  cardDesc: "mt-1 text-xs text-zinc-600",

  input:
    "placeholder:text-zinc-400 text-zinc-900 " +
    "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",

  helper: "mt-2 text-xs text-zinc-500",

  previewBox:
    "mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800",

  actions: "mt-4 flex justify-end gap-2",
  ghostBtn:
    "rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200",
  primaryBtn:
    "rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 active:bg-zinc-900",
} as const;
