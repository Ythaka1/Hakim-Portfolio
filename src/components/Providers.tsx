"use client";

import { AmbientProvider } from "./ambient";
import CursorDot from "./CursorDot";
import { LenisProvider } from "./lenis";
import Nav from "./Nav";
import { SoundProvider } from "./sound";
import { ThemeProvider } from "./theme";
import { TransitionProvider } from "./transition";

/* Client shell: sound → theme (chime on toggle) → music → scroll → wipes. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SoundProvider>
      <ThemeProvider>
        <AmbientProvider>
          <LenisProvider>
            <TransitionProvider>
              <Nav />
              {children}
              <CursorDot />
            </TransitionProvider>
          </LenisProvider>
        </AmbientProvider>
      </ThemeProvider>
    </SoundProvider>
  );
}
