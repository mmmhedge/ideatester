import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function append(file: string, line: object) {
  // Vercel/serverless filesystems are read-only outside /tmp. We try cwd first,
  // fall back to /tmp so local dev gets a persistent file and prod still logs.
  const payload = JSON.stringify(line) + "\n";
  for (const dir of [DATA_DIR, "/tmp"]) {
    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.appendFile(path.join(dir, file), payload);
      return;
    } catch {
      // try next location
    }
  }
}

export async function logEvent(ctx: { event: string; eventId: string; props: Record<string, unknown>; path?: string; ip?: string }) {
  await append("events.jsonl", {
    ts: new Date().toISOString(),
    ...ctx,
  });
}

export async function logLead(lead: object) {
  await append("leads.jsonl", { ts: new Date().toISOString(), ...lead });
}
