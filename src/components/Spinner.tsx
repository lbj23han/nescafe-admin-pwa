"use client";

type Props = {
  size?: "xs" | "sm" | "md";
  className?: string;
};

const SIZE_MAP = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
};

export function Spinner({ size = "sm", className }: Props) {
  return (
    <span
      aria-label="loading"
      className={[
        "inline-block rounded-full border-current border-t-transparent animate-spin",
        SIZE_MAP[size],
        className,
      ].join(" ")}
    />
  );
}
