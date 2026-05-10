import type { Idea } from "@/ideas/types";

export function FAQ({ idea }: { idea: Idea }) {
  if (!idea.faq?.length) return null;
  return (
    <section className="px-6 py-12 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">FAQ</h2>
      <div className="space-y-5">
        {idea.faq.map((f) => (
          <details key={f.q} className="group border-b border-neutral-200 pb-3">
            <summary className="cursor-pointer font-medium list-none flex justify-between">
              {f.q}
              <span className="ml-2 text-neutral-400 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-2 text-sm text-neutral-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
