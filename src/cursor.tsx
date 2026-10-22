import { useEffect, useRef } from "react";

const CLICKABLE = "a, button, select, summary, label, [role='button']";
const TEXT = "input:not([type='checkbox']):not([type='radio']), textarea";

// A dot that follows the pointer exactly and a ring that trails it. Over anything
// clickable the ring grows and fills slightly; over text fields both step aside for
// the normal caret. Mouse-only: touch screens keep their default behaviour.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("custom-cursor");
    let x = -100, y = -100, rx = -100, ry = -100, frame = 0;

    const set = (type: string) => {
      dot.current?.setAttribute("data-type", type);
      ring.current?.setAttribute("data-type", type);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      const t = e.target as Element;
      set(t.closest?.(TEXT) ? "text" : t.closest?.(CLICKABLE) ? "hover" : "default");
      root.classList.remove("cursor-away");
    };
    const tick = () => {
      rx += (x - rx) * (still ? 1 : 0.18);
      ry += (y - ry) * (still ? 1 : 0.18);
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      frame = requestAnimationFrame(tick);
    };
    const down = () => root.classList.add("cursor-down");
    const up = () => root.classList.remove("cursor-down");
    const away = () => root.classList.add("cursor-away");

    addEventListener("pointermove", move);
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    document.addEventListener("pointerleave", away);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", away);
      root.classList.remove("custom-cursor", "cursor-down", "cursor-away");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" data-type="default" aria-hidden>
        <i />
      </div>
      <div ref={dot} className="cursor-dot" data-type="default" aria-hidden>
        <i />
      </div>
    </>
  );
}
