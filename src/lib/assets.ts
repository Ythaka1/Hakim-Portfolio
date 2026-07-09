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

export const ASSETS = {
  /* hero-cross-blur.jpg — heavily blurred, low-contrast image of Jesus
     carrying the cross. Used as the hero backdrop. */
  heroCross: {
    dark: "/images/hero-cross-blur.jpg",
    light: "/images/hero-cross-blur-light.jpg",
    alt: "",
  },

  /* about-portrait-suit.jpg — huge portrait, revealed on scroll. */
  aboutPortrait: {
    dark: "/images/about-portrait-suit.jpg",
    light: "/images/about-portrait-suit-light.jpg",
    alt: "Portrait of Hakim",
  },

  /* about-sitting.jpg — second about image. */
  aboutSitting: {
    dark: "/images/about-sitting.jpg",
    light: "/images/about-sitting-light.jpg",
    alt: "Hakim, seated",
  },

  /* quote-portrait.jpg — small framed portrait above each hero quote. */
  quotePortrait: {
    dark: "/images/quote-portrait.jpg",
    light: "/images/quote-portrait-light.jpg",
    alt: "Portrait",
  },
} satisfies Record<string, PairedAsset>;
