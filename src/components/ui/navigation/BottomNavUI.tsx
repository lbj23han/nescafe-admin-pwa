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

function NavIcon({ navKey, active }: { navKey: string; active?: boolean }) {
  const color = active ? "#18181B" : "#A1A1AA";

  if (navKey === "main") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
      </svg>
    );
  }
  if (navKey === "departments") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }
  if (navKey === "today") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 15" />
      </svg>
    );
  }
  if (navKey === "mypage") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    );
  }
  return null;
}

function itemClass(active?: boolean) {
  return [
    "flex h-full flex-col items-center justify-center gap-0.5",
    active ? "text-[#18181B] font-semibold" : "text-zinc-400",
    "text-[10px] sm:text-[10px]",
  ].join(" ");
}

function NavButton({
  navKey,
  label,
  onClick,
  active,
}: {
  navKey: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className={itemClass(active)}>
      <NavIcon navKey={navKey} active={active} />
      <span>{label}</span>
    </button>
  );
}

function NavLink({
  navKey,
  label,
  href,
  active,
}: {
  navKey: string;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href} className={itemClass(active)}>
      <NavIcon navKey={navKey} active={active} />
      <span>{label}</span>
    </Link>
  );
}

export function BottomNavUI({ items }: Props) {
  return (
    <div
      className="grid items-center bg-white border-t border-zinc-100 shadow-[0_-1px_8px_rgba(0,0,0,0.04)]"
      style={{
        height: "min(64px, 8vh)",
        paddingBottom: "env(safe-area-inset-bottom)",
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item) =>
        item.href ? (
          <NavLink
            key={item.key}
            navKey={item.key}
            href={item.href}
            label={item.label}
            active={item.active}
          />
        ) : (
          <NavButton
            key={item.key}
            navKey={item.key}
            onClick={item.onClick!}
            label={item.label}
            active={item.active}
          />
        )
      )}
    </div>
  );
}
