import { readDb } from "@/lib/store";
import PaperRoll from "@/components/PaperRoll";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const db = readDb();
  const entries = [...db.entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <div className="status-bar">
        <span className={`dot ${db.status.live ? "live" : ""}`} />
        <span>{db.status.live ? "live — adding now" : db.status.note ?? "resting"}</span>
      </div>
      <div className="wrap">
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-soft)", maxWidth: 560 }}>
          Submit something you made, or propose a topic for someone else to make.
          Nothing here is generated — every entry is printed on one physical sheet
          of paper and photographed by hand before it shows up on this roll.
        </p>
        <PaperRoll entries={entries} clusters={db.clusters} />
      </div>
    </>
  );
}
