import { FONTS } from "@/lib/brand/fonts";
import type { Brand } from "@/lib/brand/types";

export function Wordmark({ brand }: { brand: Brand }) {
  const weight = FONTS[brand.font].weightForWordmark;
  return (
    <div className="brand-display flex items-center gap-2 text-lg tracking-tight" style={{ fontWeight: weight }}>
      {brand.monogram && (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-current text-[var(--brand-bg,#ffffff)] text-sm">
          {brand.monogram}
        </span>
      )}
      <span>{brand.name}</span>
    </div>
  );
}
