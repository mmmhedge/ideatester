import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";
import { getIdea, listIdeas } from "@/ideas";
import { getLitepaper } from "@/lib/litepaper/load";

export function generateStaticParams() {
  return listIdeas()
    .filter((i) => i.kind === "crypto")
    .map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const idea = getIdea(slug);
  if (!idea) return {};
  return {
    title: `Litepaper · ${idea.title}`,
    description: idea.metaDescription,
  };
}

export default async function LitepaperPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const idea = getIdea(slug);
  if (!idea || idea.kind !== "crypto") notFound();

  const md = getLitepaper(slug);
  const html = md
    ? marked.parse(md, { gfm: true, breaks: false })
    : `<p><em>Litepaper not yet generated. Run <code>npm run litepaper -- ${slug}</code>.</em></p>`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500&display=swap"
      />
      <style>{LITEPAPER_CSS}</style>
      <main className="litepaper">
        <header className="lp-header">
          <a href={`/${slug}`} className="lp-back">← Back to {idea.title.split(" — ")[0] || idea.slug}</a>
          <div className="lp-meta">
            <div className="lp-tag">{idea.crypto?.chain} · {idea.crypto?.category} · Litepaper v0.1</div>
            <h1>{idea.title.split(" — ")[0] || idea.slug}</h1>
            <p className="lp-subtitle">{idea.hero.headline}</p>
            <div className="lp-byline">Draft · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
          </div>
        </header>
        <article
          className="lp-body"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: typeof html === "string" ? html : "" }}
        />
        <footer className="lp-footer">
          <a href={`/${slug}#signup`}>Get testnet access →</a>
        </footer>
      </main>
    </>
  );
}

const LITEPAPER_CSS = `
.litepaper { background: #faf7f0; color: #1c1917; min-height: 100vh; }
.litepaper, .litepaper * { font-family: 'Source Serif 4', ui-serif, Georgia, serif; }
.litepaper code, .litepaper pre { font-family: 'JetBrains Mono', ui-monospace, monospace; }

.lp-header { max-width: 720px; margin: 0 auto; padding: 4rem 1.5rem 2rem; border-bottom: 1px solid #e7e5e4; }
.lp-back { display: inline-block; font-size: 0.875rem; color: #57534e; text-decoration: none; margin-bottom: 3rem; }
.lp-back:hover { color: #1c1917; }
.lp-meta .lp-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #78716c; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem; }
.lp-meta h1 { font-size: 2.5rem; line-height: 1.15; font-weight: 700; margin: 0 0 0.75rem; letter-spacing: -0.02em; }
.lp-meta .lp-subtitle { font-style: italic; font-size: 1.125rem; color: #44403c; margin: 0 0 1.5rem; }
.lp-meta .lp-byline { font-size: 0.875rem; color: #78716c; }

.lp-body { max-width: 720px; margin: 0 auto; padding: 3rem 1.5rem; counter-reset: h2; }
.lp-body p { font-size: 1.0625rem; line-height: 1.7; margin: 0 0 1.25rem; }
.lp-body h2 { font-size: 1.5rem; line-height: 1.3; font-weight: 700; margin: 3rem 0 1rem; letter-spacing: -0.01em; counter-increment: h2; counter-reset: h3; }
.lp-body h2::before { content: counter(h2) ".  "; color: #a8a29e; font-weight: 400; }
.lp-body h3 { font-size: 1.125rem; font-weight: 600; margin: 2rem 0 0.75rem; counter-increment: h3; }
.lp-body h3::before { content: counter(h2) "." counter(h3) "  "; color: #a8a29e; font-weight: 400; }
.lp-body ul, .lp-body ol { margin: 0 0 1.25rem 1.5rem; }
.lp-body li { font-size: 1.0625rem; line-height: 1.7; margin-bottom: 0.5rem; }
.lp-body code { font-size: 0.9em; background: #f0ede4; padding: 0.1em 0.35em; border-radius: 3px; }
.lp-body pre { background: #f0ede4; padding: 1rem 1.25rem; border-radius: 4px; overflow-x: auto; font-size: 0.875rem; line-height: 1.5; margin: 1.5rem 0; }
.lp-body pre code { background: transparent; padding: 0; }
.lp-body blockquote { border-left: 3px solid #d6d3d1; margin: 1.5rem 0; padding-left: 1.25rem; color: #57534e; font-style: italic; }
.lp-body table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9375rem; }
.lp-body th, .lp-body td { padding: 0.5rem 0.75rem; text-align: left; border-bottom: 1px solid #e7e5e4; }
.lp-body th { font-weight: 600; color: #44403c; }
.lp-body a { color: #1c1917; text-decoration: underline; text-decoration-color: #a8a29e; text-underline-offset: 3px; }

.lp-footer { max-width: 720px; margin: 0 auto; padding: 2rem 1.5rem 6rem; border-top: 1px solid #e7e5e4; }
.lp-footer a { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: #1c1917; text-decoration: none; }

@media print {
  .lp-back, .lp-footer { display: none; }
  .litepaper { background: white; }
  .lp-body { padding: 0 0 2rem; }
  .lp-header { padding: 0 0 1.5rem; }
}
`;
