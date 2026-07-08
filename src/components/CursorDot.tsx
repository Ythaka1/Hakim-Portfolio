"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/*
 * Custom cursor: a small dot that follows the pointer on a spring and
 * scales up over anything interactive (links, buttons, [data-cursor]).
 * Only mounts on precise pointers; touch devices never see it.
 */
export default function CursorDot() {
  const [enabled, setEnabled] = useState(false);
  const [big, setBig] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.setAttribute("data-custom-cursor", "");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: Event) => {
      const t = e.target as HTMLElement | null;
      setBig(Boolean(t?.closest("a, button, [data-cursor]")));
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      document.documentElement.removeAttribute("data-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] h-2 w-2 rounded-full bg-fg"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ scale: big ? 3.2 : 1, opacity: big ? 0.65 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    />
  );
}
