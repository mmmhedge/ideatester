import Link from "next/link";
import { listIdeas } from "@/ideas";

export default function Home() {
  const ideas = listIdeas();
  return (
    <main className="px-6 py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight">ideatester</h1>
      <p className="mt-3 text-neutral-600">
        Tiny, modular landing pages to test ideas. One config file per idea.
      </p>
      <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
        {ideas.map((i) => (
          <li key={i.slug}>
            <Link href={`/${i.slug}`} className="flex items-center justify-between py-4 hover:bg-neutral-50 px-2">
              <div>
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-neutral-500">/{i.slug}</div>
              </div>
              <span className="text-neutral-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-neutral-500">
        Add a new idea: drop a file in <code>ideas/</code>, register it in <code>ideas/index.ts</code>, push.
      </p>
    </main>
  );
}
