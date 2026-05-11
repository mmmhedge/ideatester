"use client";
import type { Idea } from "@/ideas/types";
import type { Brand } from "@/lib/brand/types";
import { track } from "@/lib/track";

export function Hero({ idea, accent, brand }: { idea: Idea; accent: string; brand?: Brand }) {
  const headline = brand?.tagline ?? idea.hero.headline;
  return (
    <section className="px-6 pt-16 pb-12 sm:pt-24 sm:pb-20 max-w-3xl mx-auto text-center">
      {idea.hero.eyebrow && (
        <p className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium bg-${accent}-50 text-${accent}-700`}>
          {idea.hero.eyebrow}
        </p>
      )}
      <h1 className="brand-display text-4xl sm:text-5xl font-semibold tracking-tight">
        {headline}
      </h1>
      <p className="mt-5 text-lg opacity-70">{idea.hero.sub}</p>
      {brand?.heroImage && (
        <div className="mt-10 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.heroImage}
            alt=""
            className="w-full h-auto"
            loading="eager"
          />
        </div>
      )}
      <a
        href="#signup"
        onClick={() => track("cta_click", { location: "hero" })}
        className={`mt-8 inline-block rounded-md px-5 py-3 text-white font-medium bg-${accent}-600 hover:bg-${accent}-700`}
      >
        {idea.hero.primaryCta}
      </a>
    </section>
  );
}
