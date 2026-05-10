import type { Idea } from "@/ideas/types";

export function Features({ idea, accent }: { idea: Idea; accent: string }) {
  if (!idea.features?.length) return null;
  return (
    <section className="px-6 py-12 max-w-4xl mx-auto">
      <div className="grid sm:grid-cols-3 gap-8">
        {idea.features.map((f) => (
          <div key={f.title}>
            <div className={`mb-3 h-8 w-8 rounded-md bg-${accent}-100 text-${accent}-700 flex items-center justify-center font-semibold`}>
              {f.title.charAt(0)}
            </div>
            <h3 className="font-medium">{f.title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
