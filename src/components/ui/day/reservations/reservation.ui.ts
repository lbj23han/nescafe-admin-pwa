export const RESERVATION_UI = {
  stack2: "space-y-2",
  emptyText: "text-xs text-black",

  row: "flex items-center gap-2",

  inputBase:
    "h-10 rounded-xl border border-zinc-200 text-sm text-black " +
    "placeholder:text-zinc-400 outline-none focus:border-zinc-400 " +
    "disabled:bg-zinc-50 disabled:text-zinc-500",

  inputMenu: "w-full px-3",
  inputQty: "w-full px-2 text-center",
  inputPrice: "w-full px-2 text-center",

  qtyWrap: "w-12 shrink-0",
  priceWrap: "w-20 shrink-0",

  deleteButton:
    "h-10 w-10 shrink-0 rounded-xl border border-zinc-300 " +
    "text-lg font-semibold text-zinc-700 " +
    "active:text-zinc-900 active:scale-[0.96] " +
    "disabled:opacity-40 transition",

  addRowButton:
    "w-full h-10 rounded-xl border border-zinc-300 px-3 " +
    "text-sm font-medium text-zinc-800 " +
    "active:scale-[0.99] transition",

  deleteIcon: "×",
} as const;
