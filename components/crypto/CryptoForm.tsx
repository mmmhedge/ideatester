"use client";
import { useState } from "react";
import type { Idea } from "@/ideas/types";
import { track, getStoredAttribution, newEventId } from "@/lib/track";

export function CryptoForm({ idea }: { idea: Idea }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
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
      track(eventName, { value: idea.form.conversionValue, slug: idea.slug }, eventId);
      setDone(true);
    } catch {
      setError("Submission failed. Try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="border border-emerald-900 bg-emerald-950/30 rounded p-6">
        <div className="text-emerald-400 text-sm mb-2">{"// confirmed"}</div>
        <h3 className="crypto-display text-2xl mb-2 text-[#fafafa]">{idea.form.successHeadline}</h3>
        <p className="text-[#a3a3a3] text-sm">{idea.form.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {idea.form.fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="block text-xs text-[#737373] mb-1.5">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type ?? "text"}
            required={f.required}
            placeholder={f.placeholder}
            className="w-full bg-[#0f0f0f] border border-[#262626] focus:border-emerald-500 outline-none rounded px-3 py-2.5 text-sm text-[#e5e5e5] placeholder:text-[#525252] transition"
          />
        </div>
      ))}
      {error && <p className="text-xs text-rose-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-3 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-emerald-950 font-medium text-sm transition"
      >
        {submitting ? "…" : idea.form.submitLabel}
      </button>
    </form>
  );
}
