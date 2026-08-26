"use client";

import { useMemo, useState } from "react";
import type { Cluster, Entry } from "@/lib/types";

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function PaperRoll({
  entries,
  clusters,
}: {
  entries: Entry[];
  clusters: Cluster[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? entries.filter((e) => e.cluster === active) : entries),
    [active, entries]
  );

  const clusterName = (slug: string) =>
    clusters.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <>
      <div className="clusters">
        <button
          className={`chip ${active === null ? "active" : ""}`}
          onClick={() => setActive(null)}
        >
          all
        </button>
        {clusters.map((c) => (
          <button
            key={c.slug}
            className={`chip ${active === c.slug ? "active" : ""}`}
            onClick={() => setActive(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <hr className="tear" />

      {filtered.length === 0 ? (
        <div className="empty">nothing pinned here yet — be the first</div>
      ) : (
        <div className="roll">
          {filtered.map((e) => (
            <article className="entry" key={e.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.photoUrl} alt={`photo of paper entry: ${e.title}`} />
              <div className="meta">
                <span className="tag">{clusterName(e.cluster)}</span>
                <span>{e.sourceType === "topic" ? "proposed topic" : "submitted work"}</span>
                <span>{timeAgo(e.createdAt)}</span>
              </div>
              <h3>{e.title}</h3>
              <p className="desc">{e.description}</p>
              <div className="meta" style={{ marginTop: 2 }}>
                <span>by {e.contributor || "anon"}</span>
                {e.caption ? <span className="caption">{e.caption}</span> : <span />}
              </div>
              {e.link ? (
                <p style={{ marginTop: 6 }}>
                  <a className="mono" style={{ fontSize: 12 }} href={e.link} target="_blank" rel="noreferrer">
                    view the work →
                  </a>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
