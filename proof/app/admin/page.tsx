import { readDb } from "@/lib/store";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const db = readDb();
  const pending = db.submissions.filter((s) => s.status === "pending");

  return (
    <div className="wrap">
      <h1 style={{ fontSize: 24, marginTop: 24, marginBottom: 4 }}>the desk</h1>
      <p className="small" style={{ marginBottom: 20 }}>
        Review what came in, print or write it onto the physical sheet, photograph
        that section, and publish. Toggle the live light while you&apos;re at the desk.
      </p>
      <AdminPanel pending={pending} clusters={db.clusters} status={db.status} />
    </div>
  );
}
