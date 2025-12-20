"use client";

export function SelectField(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-800 ${
        props.className ?? ""
      }`}
    />
  );
}

export function AmountInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-800 placeholder:text-zinc-500 ${
        props.className ?? ""
      }`}
    />
  );
}

export function MemoInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-800 placeholder:text-zinc-500 ${
        props.className ?? ""
      }`}
    />
  );
}
