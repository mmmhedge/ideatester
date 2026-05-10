import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getIdea, listIdeas } from "@/ideas";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { SocialProof } from "@/components/SocialProof";
import { FAQ } from "@/components/FAQ";
import { WaitlistForm } from "@/components/WaitlistForm";

export function generateStaticParams() {
  return listIdeas().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const idea = getIdea(slug);
  if (!idea) return {};
  return { title: idea.title, description: idea.metaDescription };
}

export default async function IdeaPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const idea = getIdea(slug);
  if (!idea) notFound();

  const accent = idea.theme?.accent ?? "indigo";

  return (
    <main>
      <Hero idea={idea} accent={accent} />
      <Features idea={idea} accent={accent} />
      <SocialProof idea={idea} />
      <section id="signup" className="px-6 py-12 max-w-xl mx-auto scroll-mt-20">
        <WaitlistForm idea={idea} accent={accent} />
      </section>
      <FAQ idea={idea} />
      <footer className="px-6 py-12 text-center text-xs text-neutral-400">
        Built fast with ideatester.
      </footer>
    </main>
  );
}
