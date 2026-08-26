import { NextRequest, NextResponse } from "next/server";
import { newId, readDb, writeDb } from "@/lib/store";
import { checkPassphrase } from "@/lib/adminAuth";
import type { Entry } from "@/lib/types";

export async function POST(req: NextRequest) {
  const passphrase = req.headers.get("x-admin-passphrase");
  if (!checkPassphrase(passphrase)) {
    return NextResponse.json({ error: "wrong passphrase" }, { status: 401 });
  }

  const { submissionId, photoUrl, caption } = await req.json();
  if (!submissionId || !photoUrl) {
    return NextResponse.json({ error: "submissionId and photoUrl are required" }, { status: 400 });
  }

  const db = readDb();
  const submission = db.submissions.find((s) => s.id === submissionId);
  if (!submission) {
    return NextResponse.json({ error: "submission not found" }, { status: 404 });
  }
  if (submission.status !== "pending") {
    return NextResponse.json({ error: "submission already handled" }, { status: 409 });
  }

  const entry: Entry = {
    id: newId("e"),
    submissionId: submission.id,
    title: submission.title,
    cluster: submission.cluster,
    contributor: submission.contributor,
    description: submission.description,
    link: submission.link,
    sourceType: submission.kind,
    photoUrl,
    caption: caption || undefined,
    createdAt: new Date().toISOString(),
  };

  submission.status = "added";
  db.entries.unshift(entry);
  writeDb(db);

  return NextResponse.json({ entry });
}
