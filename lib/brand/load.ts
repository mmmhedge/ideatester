import { readFileSync, existsSync } from "fs";
import path from "path";
import type { Brand } from "./types";

export function getBrand(slug: string): Brand | undefined {
  const p = path.join(process.cwd(), "ideas", `${slug}.brand.json`);
  if (!existsSync(p)) return undefined;
  try {
    return JSON.parse(readFileSync(p, "utf8")) as Brand;
  } catch {
    return undefined;
  }
}
