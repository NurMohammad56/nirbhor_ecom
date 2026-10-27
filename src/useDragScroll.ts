import { useEffect, useRef, useState } from "react";
import type { RefObject, PointerEvent as ReactPointerEvent } from "react";

/** Keep touch scrolling native so vertical page gestures and momentum still work. */
export function useDragScroll(ref: RefObject<HTMLDivElement | null>) {
  const gesture = useRef<{ id: number; x: number; y: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false), timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [dragging, setDragging] = useState(false), [interacting, setInteracting] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  const finish = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setInteracting(false), 1600);
  };
  return {
    dragging, interacting,
    handlers: {
      onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!event.isPrimary || event.button !== 0 || !event.currentTarget.contains(event.target as Node)) return;
        suppressClick.current = false;
        if ((event.target as HTMLElement).closest("button,input,select,textarea")) return;
        clearTimeout(timer.current);
        gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, moved: false };
        setInteracting(true);
      },
      onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => {
        const start = gesture.current;
        if (!start || start.id !== event.pointerId || event.pointerType === "touch") return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (!start.moved && (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy))) return;
        start.moved = true;
        suppressClick.current = true;
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
        event.currentTarget.scrollLeft = start.left - dx;
      },
      onPointerUp: finish,
      onPointerCancel: finish,
      onLostPointerCapture: finish,
      onPointerLeave: (event: ReactPointerEvent<HTMLDivElement>) => { if (!gesture.current?.moved) finish(event); },
      onClickCapture: (event: React.MouseEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.target as Node)) return;
        if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
      },
      onDragStart: (event: React.DragEvent<HTMLDivElement>) => event.preventDefault(),
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget || !ref.current) return;
        if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const node = ref.current;
          node.scrollLeft = event.key === "Home" ? 0 : event.key === "End" ? node.scrollWidth : node.scrollLeft + (event.key === "ArrowRight" ? 1 : -1) * node.clientWidth * .75;
        }
      },
    },
  };
}
