"use client";

export function SubmitButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={`w-full rounded-md bg-zinc-900 py-1.5 text-xs font-medium text-white ${
        props.className ?? ""
      }`}
    />
  );
}

export function TinyButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost";
  }
) {
  const { variant = "ghost", className, ...rest } = props;

  const base =
    "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white"
      : "bg-zinc-100 text-zinc-700";

  return (
    <button {...rest} className={`${base} ${styles} ${className ?? ""}`} />
  );
}
