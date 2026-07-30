"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data";

/*
 * 3D horizontal cylinder carousel.
 *  - Cards sit on a virtual cylinder (rotateY(i·step) translateZ(radius)).
 *  - Continuous circular scroll: wheel / drag add angular velocity that
 *    decays with inertia damping; a slow idle drift keeps it alive.
 *  - Pointer parallax tilts the cylinder on damped springs — fine pointers
 *    only; touch devices get drag + idle drift with no tilt.
 *  - Volumetric thickness: each card has an offset front + back face and a
 *    shaded rim. Front = project preview + label; back = role, stack, link.
 *  - Card metrics scale with the viewport so nothing clips at 360px.
 *  - Every colour comes from a theme token: the page follows light/dark
 *    while the cards stay dark in both, gaining a stronger edge in light.
 */

const BASE_W = 264;
const RATIO = 350 / 264;
const THICKNESS = 7;

function useCardMetrics() {
  const [w, setW] = useState(BASE_W);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // leave room for the ring to swing without clipping on narrow screens
      const byWidth = vw * (vw < 640 ? 0.52 : 0.34);
      const byHeight = (vh - 220) / RATIO;
      setW(Math.max(140, Math.min(BASE_W, byWidth, byHeight)));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  return { cardW: Math.round(w), cardH: Math.round(w * RATIO) };
}

export default function CylinderCarousel({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  const { cardW, cardH } = useCardMetrics();
  const [fine, setFine] = useState(true);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const n = projects.length;
  const step = 360 / n;
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / n)) + Math.round(cardW * 0.23);

  const rotation = useMotionValue(0);
  const velocity = useRef(0); // deg per frame @60fps
  const dragging = useRef(false);
  const lastX = useRef(0);

  const IDLE = reduced ? 0 : 0.045;

  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 50) / 16.7;
    if (!dragging.current) {
      // inertia damping toward the idle drift
      velocity.current =
        velocity.current * Math.pow(0.955, dt) + IDLE * (1 - Math.pow(0.955, dt));
      rotation.set(rotation.get() + velocity.current * dt);
    }
  });

  // pointer parallax tilt with inertia damping (fine pointers only)
  const tiltX = useMotionValue(0);
  const panY = useMotionValue(0);
  const tiltXs = useSpring(tiltX, { stiffness: 60, damping: 18, mass: 0.9 });
  const panYs = useSpring(panY, { stiffness: 60, damping: 18, mass: 0.9 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // no tilt on touch: it would fight the drag and jitter with the finger
    if (!reduced && fine && e.pointerType !== "touch") {
      tiltX.set(py * -9);
      panY.set(px * 26);
    }
    if (dragging.current) {
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      rotation.set(rotation.get() + dx * 0.22);
      velocity.current = dx * 0.22;
    }
  };

  return (
    <div
      className="relative flex h-full w-full touch-pan-y select-none items-center justify-center"
      style={{ perspective: 1350 }}
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        dragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={() => (dragging.current = false)}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        tiltX.set(0);
        panY.set(0);
        dragging.current = false;
      }}
      onWheel={(e) => {
        velocity.current += e.deltaY * 0.0022;
      }}
      data-cursor
    >
      <motion.div
        className="relative"
        style={{
          width: cardW,
          height: cardH,
          transformStyle: "preserve-3d",
          rotateY: rotation,
          rotateX: tiltXs,
          x: panYs,
        }}
      >
        {projects.map((p, i) => (
          <Card
            key={p.title}
            project={p}
            angle={i * step}
            radius={radius}
            rotation={rotation}
          />
        ))}
      </motion.div>

      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.35em] text-muted md:bottom-10">
        {fine ? "drag · scroll · flip" : "swipe to explore"}
      </p>
    </div>
  );
}

function Card({
  project,
  angle,
  radius,
  rotation,
}: {
  project: Project;
  angle: number;
  radius: number;
  rotation: ReturnType<typeof useMotionValue<number>>;
}) {
  // Cards on the far side dim slightly for depth
  const facing = useTransform(rotation, (r) => {
    const a = (((angle + r) % 360) + 360) % 360;
    const front = Math.cos((a * Math.PI) / 180); // 1 facing viewer, -1 behind
    return 0.45 + 0.55 * (front + 1) * 0.5;
  });

  const face =
    "absolute inset-0 overflow-hidden rounded-2xl border";

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        transformStyle: "preserve-3d",
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        opacity: facing,
      }}
    >
      {/* rim — fakes machined card thickness */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          transform: `translateZ(${-THICKNESS}px) scale(1.012)`,
          backgroundColor: "var(--card-rim)",
        }}
        aria-hidden
      />

      {/* FRONT — project preview + label.
          Drop the real preview (video/image) in /public/images as
          e.g. project-01-preview.jpg — see src/lib/data.ts */}
      <div
        className={`${face} flex flex-col`}
        style={{
          transform: `translateZ(${THICKNESS}px)`,
          backfaceVisibility: "hidden",
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <div
          className="relative flex-1"
          style={{
            background:
              "radial-gradient(130% 100% at 25% 15%, rgba(194,162,95,0.14) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)",
          }}
          data-asset={project.preview}
        >
          <span
            className="absolute bottom-2 right-3 font-mono text-[9px]"
            style={{ color: "var(--card-fg-dim)" }}
          >
            {project.preview}
          </span>
        </div>
        <div
          className="flex items-end justify-between border-t px-4 py-3"
          style={{ borderColor: "var(--card-hairline)" }}
        >
          <span
            className="font-display text-base md:text-lg"
            style={{ color: "var(--card-fg)" }}
          >
            {project.title}
          </span>
          <span
            className="text-[10px] tracking-[0.2em]"
            style={{ color: "var(--card-fg-dim)" }}
          >
            {project.year}
          </span>
        </div>
      </div>

      {/* BACK — role, stack, link */}
      <div
        className={`${face} flex flex-col justify-between p-4 md:p-5`}
        style={{
          transform: `rotateY(180deg) translateZ(${THICKNESS}px)`,
          backfaceVisibility: "hidden",
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <div>
          <p className="eyebrow mb-3">{project.role}</p>
          <ul className="space-y-1.5">
            {project.stack.map((s) => (
              <li key={s} className="text-sm" style={{ color: "var(--card-fg-dim)" }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
        {/* href="#" placeholder — point at the live project later */}
        <a
          href={project.href}
          className="inline-flex min-h-[44px] items-center text-[11px] uppercase tracking-[0.25em] transition-colors duration-400 hover:text-accent"
          style={{ color: "var(--card-fg)" }}
        >
          view project ↗
        </a>
      </div>
    </motion.div>
  );
}
