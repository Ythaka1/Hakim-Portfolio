"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import type { Project } from "@/lib/data";

/*
 * 3D horizontal cylinder carousel.
 *  - Cards sit on a virtual cylinder (rotateY(i·step) translateZ(radius)).
 *  - Continuous circular scroll: wheel / drag add angular velocity that
 *    decays with inertia damping; a slow idle drift keeps it alive.
 *  - Mouse parallax: the whole cylinder tilts on damped springs.
 *  - Volumetric thickness: each card has an offset front + back face and a
 *    shaded rim. Front = project preview + label; back = role, stack, link.
 *  - Scene perspective: 1350px. Designed for a pure black background.
 */

const CARD_W = 264;
const CARD_H = 350;
const THICKNESS = 7;

export default function CylinderCarousel({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  const n = projects.length;
  const step = 360 / n;
  const radius = Math.round(CARD_W / 2 / Math.tan(Math.PI / n)) + 60;

  const rotation = useMotionValue(0);
  const velocity = useRef(0); // deg per frame @60fps
  const dragging = useRef(false);
  const lastX = useRef(0);

  const IDLE = reduced ? 0 : 0.045;

  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 50) / 16.7;
    if (!dragging.current) {
      // inertia damping toward the idle drift
      velocity.current = velocity.current * Math.pow(0.955, dt) + IDLE * (1 - Math.pow(0.955, dt));
      rotation.set(rotation.get() + velocity.current * dt);
    }
  });

  // pointer parallax tilt with inertia damping
  const tiltX = useMotionValue(0);
  const panY = useMotionValue(0);
  const tiltXs = useSpring(tiltX, { stiffness: 60, damping: 18, mass: 0.9 });
  const panYs = useSpring(panY, { stiffness: 60, damping: 18, mass: 0.9 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (!reduced) {
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
      className="relative flex h-full w-full touch-pan-y items-center justify-center select-none"
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
          width: CARD_W,
          height: CARD_H,
          transformStyle: "preserve-3d",
          rotateY: rotation,
          rotateX: tiltXs,
          x: panYs,
        }}
      >
        {projects.map((p, i) => (
          <Card key={p.title} project={p} angle={i * step} radius={radius} rotation={rotation} />
        ))}
      </motion.div>

      <p className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-white/30">
        drag · scroll · flip
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
        className="absolute inset-0 rounded-2xl bg-neutral-700/60"
        style={{ transform: `translateZ(${-THICKNESS}px) scale(1.012)` }}
        aria-hidden
      />

      {/* FRONT — project preview + label.
          Drop the real preview (video/image) in /public/images as
          e.g. project-01-preview.jpg — see src/lib/data.ts */}
      <div
        className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-neutral-950"
        style={{ transform: `translateZ(${THICKNESS}px)`, backfaceVisibility: "hidden" }}
      >
        <div
          className="relative flex-1"
          style={{
            background:
              "radial-gradient(130% 100% at 25% 15%, rgba(194,162,95,0.14) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)",
          }}
          data-asset={project.preview}
        >
          <span className="absolute bottom-2 right-3 font-mono text-[9px] text-white/25">
            {project.preview}
          </span>
        </div>
        <div className="flex items-end justify-between border-t border-white/10 px-4 py-3">
          <span className="font-display text-lg text-white/90">{project.title}</span>
          <span className="text-[10px] tracking-[0.2em] text-white/40">{project.year}</span>
        </div>
      </div>

      {/* BACK — role, stack, link */}
      <div
        className="absolute inset-0 flex rotate-y-180 flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-neutral-950 p-5"
        style={{
          transform: `rotateY(180deg) translateZ(${THICKNESS}px)`,
          backfaceVisibility: "hidden",
        }}
      >
        <div>
          <p className="eyebrow mb-3">{project.role}</p>
          <ul className="space-y-1.5">
            {project.stack.map((s) => (
              <li key={s} className="text-sm text-white/60">
                {s}
              </li>
            ))}
          </ul>
        </div>
        {/* href="#" placeholder — point at the live project later */}
        <a
          href={project.href}
          className="text-[11px] uppercase tracking-[0.25em] text-white/70 transition-colors duration-400 hover:text-[#c2a25f]"
        >
          view project ↗
        </a>
      </div>
    </motion.div>
  );
}
