"use client";
import type { Idea } from "@/ideas/types";
import { track } from "@/lib/track";

export function Hero({ idea, accent }: { idea: Idea; accent: string }) {
  return (
    <section className="px-6 pt-16 pb-12 sm:pt-24 sm:pb-20 max-w-3xl mx-auto text-center">
      {idea.hero.eyebrow && (
        <p className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium bg-${accent}-50 text-${accent}-700`}>
          {idea.hero.eyebrow}
        </p>
      )}
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
        {idea.hero.headline}
      </h1>
      <p className="mt-5 text-lg text-neutral-600">{idea.hero.sub}</p>
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
