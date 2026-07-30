"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { useSound } from "@/components/sound";
import { EMAIL, SOCIALS } from "@/lib/data";

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

/*
 * CONTACT — full viewport. The email is huge, centered, and magnetic:
 * it leans toward the pointer on damped springs and snaps back on leave.
 */
export default function Contact() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const { tick } = useSound();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 120, damping: 16, mass: 0.6 });
  const y = useSpring(my, { stiffness: 120, damping: 16, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    const rect = zoneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px * 46);
    my.set(py * 30);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <motion.p
        className="eyebrow mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      >
        say hello
      </motion.p>

      <div
        ref={zoneRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="flex items-center justify-center px-4 py-10"
      >
        <motion.a
          href={`mailto:${EMAIL}`}
          onMouseEnter={tick}
          style={{ x, y }}
          className="font-display flex min-h-[44px] max-w-full items-center break-words px-2 py-2 text-center text-[clamp(1.5rem,5.6vw,4.4rem)] leading-[1.2] transition-colors duration-500 hover:text-accent md:break-normal"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
        >
          {EMAIL}
        </motion.a>
      </div>

      <motion.ul
        className="mt-16 flex items-center gap-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
      >
        {SOCIALS.map((s) => (
          <li key={s.label}>
            {/* href="#" — drop the real profile URLs into src/lib/data.ts */}
            <a
              href={s.href}
              onMouseEnter={tick}
              className="flex min-h-[44px] items-center text-[11px] uppercase tracking-[0.3em] text-muted transition-colors duration-400 hover:text-accent"
            >
              {s.label}
            </a>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
