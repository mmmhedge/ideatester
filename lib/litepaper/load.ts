import { readFileSync, existsSync } from "fs";
import path from "path";

export function getLitepaper(slug: string): string | undefined {
  const p = path.join(process.cwd(), "ideas", `${slug}.litepaper.md`);
  if (!existsSync(p)) return undefined;
  try {
    return readFileSync(p, "utf8");
  } catch {
    return undefined;
  }
}
