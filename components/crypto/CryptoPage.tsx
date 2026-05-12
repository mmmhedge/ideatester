import type { Idea } from "@/ideas/types";
import { CryptoForm } from "./CryptoForm";
import { CryptoLinks } from "./CryptoLinks";

const STATUS_LABEL: Record<NonNullable<NonNullable<Idea["crypto"]>["status"]>, string> = {
  concept: "Concept",
  testnet: "Testnet",
  audit: "In Audit",
  mainnet: "Live on Mainnet",
};

export function CryptoPage({ idea }: { idea: Idea }) {
  if (!idea.crypto) return null;
  const c = idea.crypto;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap"
      />
      <style>{`
        :root { color-scheme: dark; }
        .crypto-root { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }
        .crypto-display { font-family: 'Instrument Serif', ui-serif, Georgia, serif; }
      `}</style>

      <main className="crypto-root min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
        <nav className="px-6 py-5 max-w-5xl mx-auto flex items-center justify-between text-xs">
          <span className="font-medium">{idea.title.split(" — ")[0] || idea.slug}</span>
          <div className="flex items-center gap-5 text-[#a3a3a3]">
            <a href="#problem" className="hover:text-[#e5e5e5]">Problem</a>
            <a href="#architecture" className="hover:text-[#e5e5e5]">Architecture</a>
            {c.roadmap && <a href="#roadmap" className="hover:text-[#e5e5e5]">Roadmap</a>}
            <a href={`/${idea.slug}/litepaper`} className="hover:text-[#e5e5e5]">Litepaper</a>
          </div>
        </nav>

        <section className="px-6 pt-20 pb-16 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#a3a3a3] mb-6">
            {c.chain && <span className="px-2 py-1 border border-[#262626] rounded">{c.chain}</span>}
            {c.category && <span className="px-2 py-1 border border-[#262626] rounded">{c.category}</span>}
            {c.status && (
              <span className="px-2 py-1 border border-emerald-900 bg-emerald-950/40 text-emerald-400 rounded">
                {STATUS_LABEL[c.status]}
              </span>
            )}
          </div>
          <h1 className="crypto-display text-5xl sm:text-6xl leading-[1.05] tracking-tight">
            {idea.hero.headline}
          </h1>
          <p className="mt-6 text-[#a3a3a3] text-base max-w-xl">{idea.hero.sub}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={`/${idea.slug}/litepaper`}
              className="px-4 py-2.5 rounded border border-[#404040] hover:border-[#e5e5e5] text-sm transition"
            >
              {idea.hero.primaryCta || "Read the litepaper"}
            </a>
            <a
              href="#signup"
              className="px-4 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-medium text-sm transition"
            >
              Get testnet access →
            </a>
          </div>
        </section>

        <section id="problem" className="px-6 py-16 max-w-5xl mx-auto border-t border-[#1a1a1a]">
          <div className="grid sm:grid-cols-2 gap-12">
            <div>
              <div className="text-xs text-[#737373] mb-3">{"// problem"}</div>
              <p className="text-[#d4d4d4] text-base leading-relaxed">{c.problem}</p>
            </div>
            <div>
              <div className="text-xs text-[#737373] mb-3">{"// solution"}</div>
              <p className="text-[#d4d4d4] text-base leading-relaxed">{c.solution}</p>
            </div>
          </div>
          <div className="mt-12 p-6 border border-[#262626] rounded bg-[#0f0f0f]">
            <div className="text-xs text-emerald-400 mb-2">{"// key insight"}</div>
            <p className="crypto-display text-2xl leading-snug text-[#fafafa]">{c.keyInsight}</p>
          </div>
        </section>

        <section id="architecture" className="px-6 py-16 max-w-5xl mx-auto border-t border-[#1a1a1a]">
          <div className="text-xs text-[#737373] mb-3">{"// architecture"}</div>
          <p className="text-[#d4d4d4] text-base leading-relaxed mb-10 max-w-2xl">
            {c.architecture.overview}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {c.architecture.components.map((comp, i) => (
              <div key={comp.name} className="p-5 border border-[#262626] rounded bg-[#0f0f0f]">
                <div className="text-xs text-[#525252] mb-2">{String(i + 1).padStart(2, "0")}</div>
                <div className="text-emerald-400 text-sm mb-2">{comp.name}</div>
                <p className="text-[#a3a3a3] text-sm leading-relaxed">{comp.role}</p>
              </div>
            ))}
          </div>
        </section>

        {c.tokenomics && (
          <section className="px-6 py-16 max-w-5xl mx-auto border-t border-[#1a1a1a]">
            <div className="text-xs text-[#737373] mb-3">{"// tokenomics"}</div>
            <div className="flex flex-wrap gap-x-10 gap-y-2 mb-8 text-sm">
              <div><span className="text-[#737373]">Symbol </span><span>{c.tokenomics.symbol}</span></div>
              <div><span className="text-[#737373]">Supply </span><span>{c.tokenomics.totalSupply}</span></div>
            </div>
            <p className="text-[#d4d4d4] text-sm leading-relaxed mb-8 max-w-2xl">{c.tokenomics.utility}</p>
            <div className="border border-[#262626] rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#0f0f0f] text-[#737373]">
                  <tr>
                    <th className="text-left px-4 py-3 font-normal">Allocation</th>
                    <th className="text-right px-4 py-3 font-normal w-24">%</th>
                    <th className="text-left px-4 py-3 font-normal">Vesting</th>
                  </tr>
                </thead>
                <tbody>
                  {c.tokenomics.allocations.map((a) => (
                    <tr key={a.name} className="border-t border-[#1a1a1a]">
                      <td className="px-4 py-3 text-[#d4d4d4]">{a.name}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{a.pct}%</td>
                      <td className="px-4 py-3 text-[#a3a3a3]">{a.vesting || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {c.roadmap && (
          <section id="roadmap" className="px-6 py-16 max-w-5xl mx-auto border-t border-[#1a1a1a]">
            <div className="text-xs text-[#737373] mb-8">{"// roadmap"}</div>
            <div className="space-y-6">
              {c.roadmap.map((r) => (
                <div key={r.phase} className="grid sm:grid-cols-[140px_1fr] gap-4 sm:gap-8">
                  <div>
                    <div className="text-[#fafafa] text-sm">{r.phase}</div>
                    <div
                      className={
                        "text-xs mt-1 " +
                        (r.status === "shipped"
                          ? "text-emerald-400"
                          : r.status === "in-progress"
                            ? "text-amber-400"
                            : "text-[#737373]")
                      }
                    >
                      {r.status === "shipped" ? "✓ shipped" : r.status === "in-progress" ? "→ in progress" : "· planned"}
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {r.items.map((it, i) => (
                      <li key={i} className="text-[#d4d4d4] before:content-['—'] before:text-[#525252] before:mr-3">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="signup" className="px-6 py-20 max-w-xl mx-auto border-t border-[#1a1a1a] scroll-mt-20">
          <div className="text-xs text-[#737373] mb-3">{"// access"}</div>
          <h2 className="crypto-display text-3xl mb-3">Get testnet access.</h2>
          <p className="text-[#a3a3a3] text-sm mb-8">
            Drops roll out by platform. Tell us what you're building and we'll prioritize.
          </p>
          <CryptoForm idea={idea} />
        </section>

        <CryptoLinks links={c.links} />
      </main>
    </>
  );
}
