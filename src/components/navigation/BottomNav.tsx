"use client";

import { usePathname, useRouter } from "next/navigation";
import { BottomNavUI } from "../ui/navigation/BottomNavUI";
import { NAV_COPY, NAV_HREF } from "@/constants/navigation";

function formatYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isMainActive(pathname: string) {
  return pathname === NAV_HREF.main || pathname.startsWith(`${NAV_HREF.day}/`);
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const goToday = () => {
    const today = formatYmd(new Date());
    router.push(`${NAV_HREF.day}/${today}`);
  };

  const items = [
    {
      key: "main",
      label: NAV_COPY.calendar,
      href: NAV_HREF.main,
      active: isMainActive(pathname),
    },
    {
      key: "departments",
      label: NAV_COPY.departments,
      href: NAV_HREF.departments,
      active: pathname === NAV_HREF.departments,
    },
    {
      key: "today",
      label: NAV_COPY.today,
      onClick: goToday,
      active: pathname.startsWith(`${NAV_HREF.day}/`),
    },
  ];

  return <BottomNavUI items={items} />;
}
