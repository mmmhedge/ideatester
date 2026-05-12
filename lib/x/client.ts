import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { TwitterApi } from "twitter-api-v2";

const TOKENS_PATH = join(process.cwd(), ".x-tokens.json");

type StoredTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export function tokensExist(): boolean {
  return existsSync(TOKENS_PATH);
}

export function readTokens(): StoredTokens {
  if (!existsSync(TOKENS_PATH)) {
    throw new Error("No X tokens. Run: npm run x -- auth");
  }
  return JSON.parse(readFileSync(TOKENS_PATH, "utf8"));
}

export function writeTokens(t: StoredTokens) {
  mkdirSync(join(process.cwd()), { recursive: true });
  writeFileSync(TOKENS_PATH, JSON.stringify(t, null, 2) + "\n");
}

/**
 * Returns a TwitterApi client with a valid access token, refreshing if needed.
 * On refresh, persists the new tokens.
 */
export async function getClient(): Promise<TwitterApi> {
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  if (!clientId) throw new Error("X_CLIENT_ID not set in .env.local");

  const tokens = readTokens();
  if (Date.now() < tokens.expiresAt - 60_000) {
    return new TwitterApi(tokens.accessToken);
  }

  // Refresh.
  const refresher = clientSecret
    ? new TwitterApi({ clientId, clientSecret })
    : new TwitterApi({ clientId });
  const refreshed = await refresher.refreshOAuth2Token(tokens.refreshToken);
  const next: StoredTokens = {
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken ?? tokens.refreshToken,
    expiresAt: Date.now() + (refreshed.expiresIn ?? 7200) * 1000,
  };
  writeTokens(next);
  return new TwitterApi(next.accessToken);
}

export const X_SCOPES = ["tweet.read", "tweet.write", "users.read", "offline.access"];
