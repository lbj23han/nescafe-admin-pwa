"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type Point = { x: number; y: number };

const STORAGE_KEY = "floatingMenuFabPos:v1";
const FAB_SIZE = 56;
const MARGIN = 16;
const BOTTOM_NAV_PX = 56;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isPoint(v: unknown): v is Point {
  if (!isRecord(v)) return false;
  return (
    typeof v.x === "number" &&
    Number.isFinite(v.x) &&
    typeof v.y === "number" &&
    Number.isFinite(v.y)
  );
}

function safeParsePoint(json: string | null): Point | null {
  if (!json) return null;
  try {
    const parsed: unknown = JSON.parse(json);
    return isPoint(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getBounds() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const maxX = w - FAB_SIZE - MARGIN;
  const maxY = h - FAB_SIZE - (BOTTOM_NAV_PX + MARGIN);

  return {
    minX: MARGIN,
    minY: MARGIN,
    maxX: Math.max(MARGIN, maxX),
    maxY: Math.max(MARGIN, maxY),
  };
}

function getDefaultPos(): Point {
  const { minX, minY, maxX, maxY } = getBounds();
  return { x: clamp(maxX, minX, maxX), y: clamp(maxY, minY, maxY) };
}

function applyPos(el: HTMLElement, p: Point) {
  el.style.left = `${p.x}px`;
  el.style.top = `${p.y}px`;
}

export function useDraggableFab() {
  const fabElRef = useRef<HTMLElement | null>(null);
  const latestPosRef = useRef<Point>({ x: 0, y: 0 });

  const draggingRef = useRef(false);
  const movedRef = useRef(false);

  const startRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const persist = useCallback((p: Point) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      // ignore
    }
  }, []);

  const setPos = useCallback(
    (p: Point, { save }: { save: boolean }) => {
      latestPosRef.current = p;
      const el = fabElRef.current;
      if (el) applyPos(el, p);
      if (save) persist(p);
    },
    [persist]
  );

  // mount 이후 DOM 초기화만 수행 (setState 0회)
  useEffect(() => {
    // 훅이 걸린 컴포넌트가 마운트되면, FAB 엘리먼트가 이미 pointerDown으로 ref에 들어오기 전일 수 있음.
    // 그래서 "첫 pointerDown" 때도 초기 세팅하도록 했고,
    // 여기서는 리사이즈 보정만 붙인다.
    const onResize = () => {
      const { minX, minY, maxX, maxY } = getBounds();
      const p = latestPosRef.current;
      const next = { x: clamp(p.x, minX, maxX), y: clamp(p.y, minY, maxY) };
      setPos(next, { save: true });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setPos]);

  const consumeWasDragging = useCallback(() => {
    if (!movedRef.current) return false;
    movedRef.current = false;
    return true;
  }, []);

  const trySetPointerCapture = (el: HTMLElement, pointerId: number) => {
    try {
      el.setPointerCapture(pointerId);
    } catch {
      // ignore
    }
  };

  const tryReleasePointerCapture = (el: HTMLElement, pointerId: number) => {
    try {
      el.releasePointerCapture(pointerId);
    } catch {
      // ignore
    }
  };

  const ensureInitialPos = useCallback(() => {
    // 최초 1회만 localStorage/default를 적용
    // (SSR/hydration은 default anchor class가 담당)
    if (latestPosRef.current.x !== 0 || latestPosRef.current.y !== 0) return;

    const saved = safeParsePoint(window.localStorage.getItem(STORAGE_KEY));
    const initial = saved ?? getDefaultPos();
    latestPosRef.current = initial;

    const el = fabElRef.current;
    if (el) {
      // default anchor class 제거 후 fixed 좌표계로 전환
      el.classList.remove("js-fab-default-anchor");
      applyPos(el, initial);
    }
  }, []);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const el = e.currentTarget as HTMLElement;
      fabElRef.current = el;

      ensureInitialPos();

      trySetPointerCapture(el, e.pointerId);

      draggingRef.current = true;
      movedRef.current = false;

      const base = latestPosRef.current;

      startRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originX: base.x,
        originY: base.y,
      };
    },
    [ensureInitialPos]
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      const s = startRef.current;
      if (!draggingRef.current || !s) return;
      if (e.pointerId !== s.pointerId) return;

      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;

      if (!movedRef.current && Math.hypot(dx, dy) > 5) movedRef.current = true;

      const { minX, minY, maxX, maxY } = getBounds();
      const next: Point = {
        x: clamp(s.originX + dx, minX, maxX),
        y: clamp(s.originY + dy, minY, maxY),
      };

      setPos(next, { save: false });
    },
    [setPos]
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent) => {
      const s = startRef.current;
      if (!s) return;

      const el = e.currentTarget as HTMLElement;
      tryReleasePointerCapture(el, s.pointerId);

      draggingRef.current = false;
      startRef.current = null;

      persist(latestPosRef.current);
    },
    [persist]
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    consumeWasDragging,
  };
}
