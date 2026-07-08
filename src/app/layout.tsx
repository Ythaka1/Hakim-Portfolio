import type { Metadata } from "next";
import { Cormorant_Garamond, Ephesis, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

/* Signature script for the name, a clean serif for display, neutral sans for body. */
const ephesis = Ephesis({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ephesis",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hakimmy — Frontend Developer & Designer",
  description:
    "Hakimmy · Hakim, frontend developer & designer based in Nairobi, Kenya. It's you vs you.",
};

/* Dark is the default; runs before paint so there is never a light flash. */
const themeInit = `(function(){try{var t=localStorage.getItem("hakimmy-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark";}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className={`${ephesis.variable} ${cormorant.variable} ${manrope.variable} antialiased`}
      >
        <Providers>
          <main className="relative z-10">{children}</main>
        </Providers>
        {/* Film grain — fixed overlay, never attached to scrolling content */}
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
