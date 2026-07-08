"use client";

import CursorDot from "./CursorDot";
import { LenisProvider } from "./lenis";
import Nav from "./Nav";
import { SoundProvider } from "./sound";
import { ThemeProvider } from "./theme";
import { TransitionProvider } from "./transition";

/* Client shell: sound → theme (chime on toggle) → smooth scroll → wipes. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SoundProvider>
      <ThemeProvider>
        <LenisProvider>
          <TransitionProvider>
            <Nav />
            {children}
            <CursorDot />
          </TransitionProvider>
        </LenisProvider>
      </ThemeProvider>
    </SoundProvider>
  );
}
