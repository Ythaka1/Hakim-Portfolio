"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLenis } from "./lenis";
import { useSound } from "./sound";

/*
 * Route transitions: a full-screen wipe rises to cover the page, the route
 * swaps underneath (inside the View Transitions API where supported), then
 * the wipe lifts away. Reduced-motion users get an instant navigation.
 */

const TransitionContext = createContext<{ navigate: (href: string) => void }>({
  navigate: () => {},
});

export function useTransitionNav() {
  return useContext(TransitionContext);
}

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const { click } = useSound();
  const [covering, setCovering] = useState(false);
  const pendingRef = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;
      click();

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        router.push(href);
        return;
      }

      pendingRef.current = href;
      setCovering(true);
    },
    [click, pathname, router],
  );

  // Once the wipe fully covers the screen, swap the route.
  const onCovered = useCallback(() => {
    const href = pendingRef.current;
    if (!href) return;
    pendingRef.current = null;

    const push = () => router.push(href);
    // View Transitions API where supported — the wipe hides the swap anyway.
    if ("startViewTransition" in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(push);
    } else {
      push();
    }
  }, [router]);

  // New route mounted: jump to top and lift the wipe.
  useEffect(() => {
    if (!covering) return;
    window.scrollTo(0, 0);
    lenis?.current?.scrollTo(0, { immediate: true });
    const t = setTimeout(() => setCovering(false), 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <AnimatePresence>
        {covering && (
          <motion.div
            key="wipe"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0c0b09]"
            initial={{ y: "100%" }}
            animate={{ y: "0%", transition: { duration: 0.5, ease: EASE } }}
            exit={{ y: "-100%", transition: { duration: 0.55, ease: EASE } }}
            onAnimationComplete={(def) => {
              if (typeof def === "object" && def !== null && "y" in def && def.y === "0%") onCovered();
            }}
            aria-hidden
          >
            <span className="font-signature text-4xl text-[#ece6da]/70 -rotate-3">hwc</span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

/** Internal link that routes through the wipe transition. */
export function TransitionLink({
  href,
  children,
  className,
  onHover,
  onLeave,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onHover?: () => void;
  onLeave?: () => void;
} & Omit<React.ComponentProps<typeof Link>, "href" | "onClick">) {
  const { navigate } = useTransitionNav();
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        navigate(href);
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </Link>
  );
}
