"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAmbient } from "./ambient";
import { useSound } from "./sound";
import { useTheme } from "./theme";
import { TransitionLink } from "./transition";

/*
 * Navigation:
 *  - "hwc" monogram top-left; hovering it reveals the word "home".
 *  - "works" / "contact" explode into a huge ghosted word behind the layout
 *    on hover (Kalinsky-style typographic hover).
 *  - Theme toggle far right (plays the chime via ThemeProvider).
 */

const ITEMS = [
  { label: "works", href: "/works" },
  { label: "contact", href: "/contact" },
] as const;

export default function Nav() {
  const { tick } = useSound();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [ghost, setGhost] = useState<string | null>(null);
  const [homeHover, setHomeHover] = useState(false);

  return (
    <>
      {/* Ghosted giant word behind the whole layout */}
      <AnimatePresence>
        {ghost && (
          <motion.span
            key={ghost}
            className="ghost-word"
            initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
            animate={{ opacity: 0.07, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            aria-hidden
          >
            {ghost}
          </motion.span>
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-4 py-3 md:px-10 md:py-5">
        {/* Monogram → home. Swap for a logo SVG later if you like. */}
        <TransitionLink
          href="/"
          className="relative flex min-h-[44px] items-center"
          aria-label="Home"
          onHover={() => {
            setHomeHover(true);
            tick();
          }}
          onLeave={() => setHomeHover(false)}
        >
          <span className="font-signature text-3xl leading-none -rotate-3 inline-block">
            hwc
          </span>
          <AnimatePresence>
            {homeHover && (
              <motion.span
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 text-[11px] uppercase tracking-[0.3em] text-muted whitespace-nowrap"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                home
              </motion.span>
            )}
          </AnimatePresence>
        </TransitionLink>

        <nav className="flex items-center gap-3 sm:gap-5 md:gap-8" aria-label="Main">
          {ITEMS.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className={`relative flex min-h-[44px] items-center text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 md:text-[12px] md:tracking-[0.3em] ${
                pathname === item.href ? "text-accent" : "text-fg hover:text-accent"
              }`}
              onHover={() => {
                setGhost(item.label);
                tick();
              }}
              onLeave={() => setGhost(null)}
            >
              {item.label}
            </TransitionLink>
          ))}

          <MuteToggle />

          <button
            type="button"
            onClick={toggle}
            onMouseEnter={tick}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-faint"
          >
            <motion.span
              className="block h-2.5 w-2.5 rounded-full bg-fg"
              animate={{ scale: theme === "dark" ? 1 : 0.65 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </button>
        </nav>
      </header>
    </>
  );
}

/* Ambient music mute — three equalizer bars that sway while playing. */
function MuteToggle() {
  const { muted, toggle } = useAmbient();
  const { tick } = useSound();
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseEnter={tick}
      aria-label={muted ? "Unmute background music" : "Mute background music"}
      aria-pressed={!muted}
      className="relative flex h-11 w-11 items-end justify-center gap-[3px] rounded-full border border-faint pb-[15px]"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full bg-current"
          style={{ opacity: muted ? 0.35 : 1 }}
          animate={
            muted || reduced
              ? { height: 4 }
              : { height: [5, 11, 6, 12, 5] }
          }
          transition={
            muted || reduced
              ? { duration: 0.3 }
              : { duration: 1.1 + i * 0.25, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </button>
  );
}
