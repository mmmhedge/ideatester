import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getIdea, listIdeas } from "@/ideas";
import { getBrand } from "@/lib/brand/load";
import { PALETTES } from "@/lib/brand/palettes";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { SocialProof } from "@/components/SocialProof";
import { FAQ } from "@/components/FAQ";
import { WaitlistForm } from "@/components/WaitlistForm";
import { BrandHead } from "@/components/BrandHead";
import { Wordmark } from "@/components/Wordmark";
import { CryptoPage } from "@/components/crypto/CryptoPage";

export function generateStaticParams() {
  return listIdeas().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const idea = getIdea(slug);
  if (!idea) return {};
  const brand = getBrand(slug);
  return {
    title: brand?.name ? `${brand.name} — ${brand.tagline}` : idea.title,
    description: idea.metaDescription,
  };
}

export default async function IdeaPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const idea = getIdea(slug);
  if (!idea) notFound();

  if (idea.kind === "crypto") {
    return <CryptoPage idea={idea} />;
  }

  const brand = getBrand(slug);
  const palette = brand ? PALETTES[brand.palette] : undefined;
  const accent = palette?.accent ?? idea.theme?.accent ?? "indigo";

  const style: CSSProperties = palette
    ? ({
        background: palette.bg,
        color: palette.fg,
        "--brand-bg": palette.bg,
        "--brand-fg": palette.fg,
        "--brand-muted": palette.muted,
      } as CSSProperties)
    : {};

  return (
    <main className="min-h-screen" style={style}>
      {brand && <BrandHead font={brand.font} />}
      {brand && (
        <header className="px-6 pt-6 max-w-5xl mx-auto">
          <Wordmark brand={brand} />
        </header>
      )}
      <Hero idea={idea} accent={accent} brand={brand} />
      <Features idea={idea} accent={accent} />
      <SocialProof idea={idea} />
      <section id="signup" className="px-6 py-12 max-w-xl mx-auto scroll-mt-20">
        <WaitlistForm idea={idea} accent={accent} />
      </section>
      <FAQ idea={idea} />
      <footer className="px-6 py-12 text-center text-xs opacity-50">
        {brand?.name ?? "Built fast with ideatester."}
      </footer>
    </main>
  );
}
