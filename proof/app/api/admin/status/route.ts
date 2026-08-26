import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/store";
import { checkPassphrase } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const passphrase = req.headers.get("x-admin-passphrase");
  if (!checkPassphrase(passphrase)) {
    return NextResponse.json({ error: "wrong passphrase" }, { status: 401 });
  }

  const { live, note } = await req.json();
  const db = readDb();
  db.status = {
    live: !!live,
    note: note || (live ? undefined : "resting — back when there's something new"),
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);

  return NextResponse.json({ status: db.status });
}
