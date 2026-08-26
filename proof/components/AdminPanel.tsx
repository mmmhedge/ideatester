"use client";

import { useEffect, useState } from "react";
import type { Cluster, Status, Submission } from "@/lib/types";

function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function PassphraseGate({ onUnlock }: { onUnlock: (p: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function tryUnlock() {
    setChecking(true);
    setError(null);
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-passphrase": value },
      body: JSON.stringify({}),
    });
    setChecking(false);
    if (res.status === 401) {
      setError("wrong passphrase");
      return;
    }
    localStorage.setItem("proof_admin_passphrase", value);
    onUnlock(value);
  }

  return (
    <div style={{ maxWidth: 320 }}>
      <div className="field">
        <label>passphrase</label>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
          placeholder="…"
        />
      </div>
      {error && (
        <p className="small" style={{ color: "var(--stamp)", marginBottom: 10 }}>
          {error}
        </p>
      )}
      <button className="btn" onClick={tryUnlock} disabled={checking}>
        {checking ? "checking…" : "unlock"}
      </button>
      <p className="small" style={{ marginTop: 14 }}>
        default demo passphrase: <span className="mono">letmein</span> (set{" "}
        <span className="mono">ADMIN_PASSPHRASE</span> to change it)
      </p>
    </div>
  );
}

function PendingRow({
  submission,
  clusters,
  passphrase,
  onHandled,
}: {
  submission: Submission;
  clusters: Cluster[];
  passphrase: string;
  onHandled: (id: string) => void;
}) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clusterName =
    clusters.find((c) => c.slug === submission.cluster)?.name ??
    submission.proposedCluster ??
    submission.cluster;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "upload failed");
      setPhotoUrl(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function publish() {
    if (!photoUrl) {
      setError("attach the photo of the paper first");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passphrase": passphrase },
        body: JSON.stringify({ submissionId: submission.id, photoUrl, caption }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "publish failed");
      onHandled(submission.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "publish failed");
    } finally {
      setBusy(false);
    }
  }

  async function decline() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passphrase": passphrase },
        body: JSON.stringify({ submissionId: submission.id }),
      });
      if (!res.ok) throw new Error("decline failed");
      onHandled(submission.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "decline failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pending-row">
      <div className="info" style={{ flex: 1 }}>
        <h4>
          {submission.title} <span className="tag" style={{ marginLeft: 6 }}>{clusterName}</span>
        </h4>
        <p>
          {submission.kind === "topic" ? "proposed topic" : "submitted work"} · by{" "}
          {submission.contributor} · {timeAgo(submission.createdAt)}
        </p>
        <p>{submission.description}</p>
        {submission.link && (
          <p>
            <a className="mono" style={{ fontSize: 12 }} href={submission.link} target="_blank" rel="noreferrer">
              {submission.link}
            </a>
          </p>
        )}

        <div className="field" style={{ marginTop: 10, marginBottom: 8 }}>
          <label>photo of the physical paper (after writing it on)</label>
          <input type="file" accept="image/*" onChange={handleFile} />
          {uploading && <span className="small">uploading…</span>}
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="preview" style={{ maxWidth: 200, marginTop: 8, border: "1px solid var(--rule)" }} />
          )}
        </div>
        <div className="field">
          <label>caption (optional)</label>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. pinned top left" />
        </div>
        {error && (
          <p className="small" style={{ color: "var(--stamp)" }}>
            {error}
          </p>
        )}
      </div>
      <div className="actions">
        <button className="btn" onClick={publish} disabled={busy || uploading}>
          publish
        </button>
        <button className="btn ghost" onClick={decline} disabled={busy}>
          decline
        </button>
      </div>
    </div>
  );
}

export default function AdminPanel({
  pending,
  clusters,
  status,
}: {
  pending: Submission[];
  clusters: Cluster[];
  status: Status;
}) {
  const [passphrase, setPassphrase] = useState<string | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [list, setList] = useState(pending);
  const [live, setLive] = useState(status.live);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("proof_admin_passphrase");
    if (saved) setPassphrase(saved);
    setCheckedStorage(true);
  }, []);

  async function toggleLive() {
    if (!passphrase) return;
    setToggling(true);
    const next = !live;
    const res = await fetch("/api/admin/status", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-passphrase": passphrase },
      body: JSON.stringify({ live: next }),
    });
    if (res.ok) setLive(next);
    setToggling(false);
  }

  if (!checkedStorage) return null;

  if (!passphrase) {
    return <PassphraseGate onUnlock={setPassphrase} />;
  }

  return (
    <div>
      <div className="status-bar" style={{ padding: "10px 0", marginBottom: 20 }}>
        <span className={`dot ${live ? "live" : ""}`} />
        <span>{live ? "live — adding now" : "resting"}</span>
        <button className="btn ghost" style={{ marginLeft: 12, padding: "4px 10px" }} onClick={toggleLive} disabled={toggling}>
          {live ? "go resting" : "go live"}
        </button>
      </div>

      {list.length === 0 ? (
        <div className="empty">queue is empty</div>
      ) : (
        list.map((s) => (
          <PendingRow
            key={s.id}
            submission={s}
            clusters={clusters}
            passphrase={passphrase}
            onHandled={(id) => setList((prev) => prev.filter((p) => p.id !== id))}
          />
        ))
      )}
    </div>
  );
}
