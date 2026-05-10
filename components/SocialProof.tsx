import type { Idea } from "@/ideas/types";

export function SocialProof({ idea }: { idea: Idea }) {
  if (!idea.socialProof?.length) return null;
  return (
    <section className="px-6 py-12 max-w-3xl mx-auto">
      <div className="grid gap-6">
        {idea.socialProof.map((q, i) => (
          <blockquote key={i} className="border-l-4 border-neutral-200 pl-4 italic text-neutral-700">
            "{q.quote}"
            <footer className="mt-2 not-italic text-sm text-neutral-500">
              — {q.name}{q.role ? `, ${q.role}` : ""}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
