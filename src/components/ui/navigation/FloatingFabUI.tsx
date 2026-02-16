"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { FLOATING_MENU_UI } from "./floatingMenu.ui";

type Props = {
  isOpen: boolean;
  onClick: () => void;

  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
};

export function FloatingFabUI({
  isOpen,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Props) {
  // SSR/클라 첫 렌더 동일한 기본 위치
  // 훅이 최초 pointerDown 때 이 클래스를 제거하고 left/top 적용
  const defaultAnchor =
    "js-fab-default-anchor fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+56px+16px)] z-[70]";

  return (
    <button
      type="button"
      className={`${FLOATING_MENU_UI.fab} ${defaultAnchor}`}
      // left/top은 훅이 DOM style로 직접 세팅
      style={{ position: "fixed", touchAction: "none" }}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      aria-label={isOpen ? "플로팅 메뉴 닫기" : "플로팅 메뉴 열기"}
      aria-expanded={isOpen}
    >
      <span className="text-xl leading-none">{isOpen ? "×" : "+"}</span>
    </button>
  );
}
