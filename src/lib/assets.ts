/*
 * Paired image manifest — every visual has a DARK and a LIGHT variant that
 * cross-fade with the theme toggle (Kalinsky-style paired swap).
 *
 * Drop the real files into /public/images using these exact names.
 * Until they exist, <PairedImage> renders a quiet neutral placeholder
 * labelled with the expected filename.
 */

export type PairedAsset = {
  dark: string;
  light: string;
  alt: string;
};

/* The single portrait of Hakim. Replace this one file in
   public/images/ and every frame on the site updates with it. */
export const PORTRAIT = "/images/portrait-front.png";

export const ASSETS = {
  /* hero-cross-blur.jpg — heavily blurred, low-contrast image of Jesus
     carrying the cross. Used as the hero backdrop. */
  heroCross: {
    dark: "/images/hero-cross-blur.jpg",
    light: "/images/hero-cross-blur-light.jpg",
    alt: "",
  },

  /* The one portrait, used everywhere: hero frames and both about-page
     profiles all read this single file. The second about profile is the
     same image CSS-mirrored with scaleX(-1), never a second download.
     Same file in both themes — swap the file to swap the whole site. */
  portraitProfile: {
    dark: PORTRAIT,
    light: PORTRAIT,
    alt: "Portrait of Hakim",
  },
} satisfies Record<string, PairedAsset>;

/* The hero panel frames use PORTRAIT directly as a plain <img>, not a
   paired swap — see PortraitFrame in src/app/page.tsx. */
