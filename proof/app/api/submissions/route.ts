import { NextRequest, NextResponse } from "next/server";
import { newId, readDb, writeDb } from "@/lib/store";
import type { Submission } from "@/lib/types";

export async function GET() {
  const db = readDb();
  return NextResponse.json({ submissions: db.submissions, clusters: db.clusters });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { kind, title, cluster, proposedCluster, contributor, description, link, thumbnailUrl } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!description || typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }
  if (kind !== "work" && kind !== "topic") {
    return NextResponse.json({ error: "invalid kind" }, { status: 400 });
  }
  if (!cluster || typeof cluster !== "string") {
    return NextResponse.json({ error: "cluster is required" }, { status: 400 });
  }

  const db = readDb();
  const isKnownCluster = db.clusters.some((c) => c.slug === cluster);

  const submission: Submission = {
    id: newId("sub"),
    kind,
    title: title.trim(),
    cluster: isKnownCluster ? cluster : "proposed",
    proposedCluster: isKnownCluster ? undefined : (proposedCluster || cluster),
    contributor: (contributor || "anon").trim(),
    description: description.trim(),
    link: link?.trim() || undefined,
    thumbnailUrl: thumbnailUrl || undefined,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  db.submissions.unshift(submission);
  writeDb(db);

  return NextResponse.json({ submission });
}
