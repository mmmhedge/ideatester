"use client";
import { useState } from "react";
import type { Idea } from "@/ideas/types";
import { track, getStoredAttribution, newEventId } from "@/lib/track";

export function WaitlistForm({ idea, accent }: { idea: Idea; accent: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const fields: Record<string, string> = {};
    for (const f of idea.form.fields) {
      const v = formData.get(f.name);
      if (typeof v === "string") fields[f.name] = v;
    }

    const eventId = newEventId();
    const eventName = idea.form.conversionEvent ?? "Lead";

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: idea.slug,
          eventId,
          eventName,
          value: idea.form.conversionValue,
          fields,
          attribution: getStoredAttribution(),
          integrations: idea.integrations,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      // Fire client-side conversion (Meta Pixel uses same eventId for dedup w/ CAPI).
      track(eventName, { value: idea.form.conversionValue, slug: idea.slug }, eventId);
      setDone(true);
    } catch (err) {
      setError("Something went wrong. Try again?");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-neutral-200 p-8 text-center">
        <h3 className="text-xl font-semibold">{idea.form.successHeadline}</h3>
        <p className="mt-2 text-neutral-600">{idea.form.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-neutral-200 p-6 sm:p-8 space-y-4">
      {idea.form.fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="block text-sm font-medium mb-1">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              className={`w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${accent}-500`}
              rows={3}
            />
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder}
              className={`w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${accent}-500`}
            />
          )}
        </div>
      ))}
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className={`w-full rounded-md px-4 py-3 text-white font-medium bg-${accent}-600 hover:bg-${accent}-700 disabled:opacity-60`}
      >
        {submitting ? "Submitting…" : idea.form.submitLabel}
      </button>
      <p className="text-xs text-neutral-500 text-center">
        We'll only use this to follow up. No spam.
      </p>
    </form>
  );
}
