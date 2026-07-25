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

  /* portrait-profile.jpg — ONE graded profile portrait. Both about-page
     profiles come from this single file; the opposite-facing version is
     the same image CSS-mirrored with scaleX(-1), never a second download. */
  portraitProfile: {
    dark: "/images/portrait-profile.jpg",
    light: "/images/portrait-profile-light.jpg",
    alt: "Portrait of Hakim",
  },
} satisfies Record<string, PairedAsset>;

/* The hero panel frames use a single plain image, not a paired swap:
   public/portrait-front.jpg → served at /portrait-front.jpg */
