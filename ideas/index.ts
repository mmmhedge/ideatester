import type { Idea } from "./types";
import { dogwalker } from "./dogwalker";
import { aicoach } from "./aicoach";

export const ideas: Record<string, Idea> = {
  [dogwalker.slug]: dogwalker,
  [aicoach.slug]: aicoach,
};

export function getIdea(slug: string): Idea | undefined {
  return ideas[slug];
}

export function listIdeas(): Idea[] {
  return Object.values(ideas);
}
