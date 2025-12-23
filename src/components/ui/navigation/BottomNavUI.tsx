"use client";

import Link from "next/link";

type Item = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

type Props = {
  items: Item[];
};

function itemClass(active?: boolean) {
  return [
    "flex h-full items-center justify-center",
    "text-xs sm:text-xs md:text-sm",
    active ? "font-semibold text-zinc-900" : "text-zinc-500",
  ].join(" ");
}

function NavButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className={itemClass(active)}>
      {label}
    </button>
  );
}

function NavLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href} className={itemClass(active)}>
      {label}
    </Link>
  );
}

export function BottomNavUI({ items }: Props) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-zinc-300 bg-white">
      <div className="px-4">
        <div
          className="grid items-center"
          style={{
            height: "8vh",
            paddingBottom: "env(safe-area-inset-bottom)",
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          }}
        >
          {items.map((item) =>
            item.href ? (
              <NavLink
                key={item.key}
                href={item.href}
                label={item.label}
                active={item.active}
              />
            ) : (
              <NavButton
                key={item.key}
                onClick={item.onClick!}
                label={item.label}
                active={item.active}
              />
            )
          )}
        </div>
      </div>
    </nav>
  );
}
