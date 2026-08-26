import { NextRequest, NextResponse } from "next/server";
import { checkPassphrase } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const passphrase = req.headers.get("x-admin-passphrase");
  if (!checkPassphrase(passphrase)) {
    return NextResponse.json({ error: "wrong passphrase" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
