import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/store";
import { checkPassphrase } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const passphrase = req.headers.get("x-admin-passphrase");
  if (!checkPassphrase(passphrase)) {
    return NextResponse.json({ error: "wrong passphrase" }, { status: 401 });
  }

  const { submissionId } = await req.json();
  const db = readDb();
  const submission = db.submissions.find((s) => s.id === submissionId);
  if (!submission) {
    return NextResponse.json({ error: "submission not found" }, { status: 404 });
  }
  submission.status = "declined";
  writeDb(db);

  return NextResponse.json({ ok: true });
}
