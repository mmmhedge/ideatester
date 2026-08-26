"use client";

import { useState } from "react";
import type { Cluster, SourceType } from "@/lib/types";

export default function SubmitForm({ clusters }: { clusters: Cluster[] }) {
  const [kind, setKind] = useState<SourceType>("work");
  const [title, setTitle] = useState("");
  const [cluster, setCluster] = useState(clusters[0]?.slug ?? "");
  const [newCluster, setNewCluster] = useState("");
  const [contributor, setContributor] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNewCluster = cluster === "__new__";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (isNewCluster && !newCluster.trim()) {
      setError("name the topic you're proposing a cluster for");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          title,
          cluster: isNewCluster ? "proposed" : cluster,
          proposedCluster: isNewCluster ? newCluster : undefined,
          contributor,
          description,
          link,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "something went wrong");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div>
        <span className="stamp-note">received</span>
        <p style={{ marginTop: 16, maxWidth: 480, lineHeight: 1.6 }}>
          It&apos;s in the queue. When it goes on the physical paper, it&apos;ll show
          up on the roll — no fixed schedule, it happens when it happens.
        </p>
        <button
          className="btn ghost"
          style={{ marginTop: 14 }}
          onClick={() => {
            setDone(false);
            setTitle("");
            setDescription("");
            setLink("");
          }}
        >
          submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="tabs">
        <button
          type="button"
          className={kind === "work" ? "active" : ""}
          onClick={() => setKind("work")}
        >
          submit a work
        </button>
        <button
          type="button"
          className={kind === "topic" ? "active" : ""}
          onClick={() => setKind("topic")}
        >
          propose a topic
        </button>
      </div>

      <div className="field">
        <label>{kind === "work" ? "title of the work" : "the topic / prompt"}</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            kind === "work" ? "e.g. a four-track demo recorded in a stairwell" : "e.g. photograph something before 7am"
          }
          required
        />
      </div>

      <div className="field">
        <label>cluster</label>
        <select value={cluster} onChange={(e) => setCluster(e.target.value)}>
          {clusters.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
          <option value="__new__">propose a new cluster…</option>
        </select>
      </div>

      {isNewCluster && (
        <div className="field">
          <label>new cluster name</label>
          <input
            value={newCluster}
            onChange={(e) => setNewCluster(e.target.value)}
            placeholder="e.g. sculpture"
          />
        </div>
      )}

      <div className="field">
        <label>your name (or leave blank for anon)</label>
        <input value={contributor} onChange={(e) => setContributor(e.target.value)} placeholder="anon" />
      </div>

      <div className="field">
        <label>{kind === "work" ? "say something about it" : "why this topic"}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            kind === "work"
              ? "how it was made, what it's about, whatever's true"
              : "what you want to see people make"
          }
          required
        />
      </div>

      {kind === "work" && (
        <div className="field">
          <label>link to the work (optional)</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="soundcloud, a photo, a portfolio page…"
          />
        </div>
      )}

      {error && (
        <p className="small" style={{ color: "var(--stamp)", marginBottom: 12 }}>
          {error}
        </p>
      )}

      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "sending…" : "send it in"}
      </button>
    </form>
  );
}
