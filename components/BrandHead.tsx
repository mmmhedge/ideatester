import { FONTS, googleFontUrl } from "@/lib/brand/fonts";
import type { FontKey } from "@/lib/brand/types";

/**
 * Renders a Google Fonts <link> for the chosen font. React 19 hoists <link>
 * elements rendered anywhere in the tree into <head>, so this can live inside
 * the page component.
 */
export function BrandHead({ font }: { font: FontKey }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={googleFontUrl(font)} />
      <style>{`
        .brand-display, .brand-display * { font-family: '${FONTS[font].family}', system-ui, sans-serif; }
      `}</style>
    </>
  );
}
