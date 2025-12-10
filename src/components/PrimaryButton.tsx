// components/PrimaryButton.tsx
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function PrimaryButton({
  variant = "primary",
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-medium px-4 py-3 transition";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white disabled:bg-zinc-300"
      : "bg-zinc-100 text-zinc-700";

  return (
    <button className={`${base} ${styles}`} {...rest}>
      {children}
    </button>
  );
}
