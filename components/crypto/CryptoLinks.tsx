import type { CryptoFields } from "@/ideas/types";

export function CryptoLinks({ links }: { links?: CryptoFields["links"] }) {
  if (!links) return <footer className="px-6 py-12 text-center text-xs text-[#525252]">·</footer>;
  const entries = [
    ["X", links.x && `https://x.com/${links.x.replace(/^@/, "")}`],
    ["GitHub", links.github && (links.github.startsWith("http") ? links.github : `https://${links.github}`)],
    ["Docs", links.docs && (links.docs.startsWith("http") ? links.docs : `https://${links.docs}`)],
    ["Discord", links.discord],
    ["Telegram", links.telegram],
    ["Mirror", links.mirror],
  ].filter(([, v]) => !!v) as [string, string][];

  return (
    <footer className="px-6 py-12 max-w-5xl mx-auto border-t border-[#1a1a1a] text-xs text-[#737373]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span>© {new Date().getFullYear()}</span>
        <div className="flex flex-wrap gap-5">
          {entries.map(([name, href]) => (
            <a key={name} href={href} target="_blank" rel="noreferrer" className="hover:text-[#e5e5e5]">
              {name} ↗
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
