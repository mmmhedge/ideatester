import fs from "node:fs";
import path from "node:path";
import type { DB } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const SEED: DB = {
  clusters: [
    { slug: "photography", name: "Photography", official: true },
    { slug: "music", name: "Music", official: true },
    { slug: "visual-art", name: "Visual Art", official: true },
    { slug: "design", name: "Design", official: true },
    { slug: "writing", name: "Writing", official: true },
    { slug: "film", name: "Film", official: true },
    { slug: "craft", name: "Craft", official: true },
    { slug: "proposed", name: "Proposed", official: false },
  ],
  submissions: [
    {
      id: "s1",
      kind: "topic",
      title: "Photograph something before 7am",
      cluster: "photography",
      contributor: "R.",
      description: "Nobody shoots mornings anymore. Prove it.",
      createdAt: daysAgo(1),
      status: "pending",
    },
    {
      id: "s2",
      kind: "work",
      title: "a four-track demo recorded in a stairwell",
      cluster: "music",
      contributor: "sof",
      description: "Reverb from concrete, not a plugin.",
      link: "",
      createdAt: daysAgo(0.3),
      status: "pending",
    },
  ],
  entries: [
    {
      id: "e1",
      title: "the first thing",
      cluster: "design",
      contributor: "M.P.",
      description:
        "A typeface sketched by hand over three notebooks, because that's how this started.",
      sourceType: "work",
      photoUrl: "/seed/seed-1.svg",
      caption: "pinned 03 — top left, before coffee",
      createdAt: daysAgo(6),
    },
    {
      id: "e2",
      title: "a topic: draw your commute",
      cluster: "visual-art",
      contributor: "anon",
      description:
        "Whatever you saw on the way here today. Pencil, pen, whatever's in your bag.",
      sourceType: "topic",
      photoUrl: "/seed/seed-2.svg",
      caption: "taped under the window",
      createdAt: daysAgo(4),
    },
    {
      id: "e3",
      title: "a cassette left on the porch",
      cluster: "music",
      contributor: "delfin",
      description: "Field recording of rain on a tin roof, 11 minutes, unedited.",
      sourceType: "work",
      photoUrl: "/seed/seed-3.svg",
      caption: "stapled, slightly crooked",
      createdAt: daysAgo(2),
    },
  ],
  status: {
    live: false,
    note: "resting — back when there's something new",
    updatedAt: daysAgo(0.1),
  },
};

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString();
}

function ensureDb(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(SEED, null, 2));
  }
}

export function readDb(): DB {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DB;
}

export function writeDb(db: DB): void {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
