import { readDb } from "@/lib/store";
import SubmitForm from "@/components/SubmitForm";

export const dynamic = "force-dynamic";

export default function SubmitPage() {
  const db = readDb();
  const officialClusters = db.clusters.filter((c) => c.official);

  return (
    <div className="wrap">
      <h1 style={{ fontSize: 24, marginTop: 24, marginBottom: 4 }}>add to the paper</h1>
      <p className="small" style={{ marginBottom: 20 }}>
        Submit something you actually made, or propose a topic for someone else to
        make. Every accepted submission gets written or printed onto the physical
        sheet by hand, photographed, and pinned to the roll.
      </p>
      <SubmitForm clusters={officialClusters} />
    </div>
  );
}
