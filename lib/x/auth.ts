import http from "http";
import { URL } from "url";
import { TwitterApi } from "twitter-api-v2";
import { writeTokens, X_SCOPES } from "./client";

const CALLBACK_PORT = 8787;
const CALLBACK_URL = `http://127.0.0.1:${CALLBACK_PORT}/callback`;

/**
 * One-time OAuth 2.0 PKCE flow. Spins a local HTTP server, opens the X
 * authorization URL, captures the code, exchanges for tokens, persists.
 */
export async function runAuthFlow(): Promise<void> {
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  if (!clientId) throw new Error("X_CLIENT_ID not set in .env.local");

  const client = clientSecret
    ? new TwitterApi({ clientId, clientSecret })
    : new TwitterApi({ clientId });

  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(CALLBACK_URL, {
    scope: X_SCOPES,
  });

  console.log("\n1. Open this URL in your browser and authorize:\n");
  console.log(`   ${url}\n`);
  console.log("2. After approving, your browser will be redirected to localhost. Keep this terminal open.\n");

  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const reqUrl = new URL(req.url ?? "/", `http://127.0.0.1:${CALLBACK_PORT}`);
        if (reqUrl.pathname !== "/callback") {
          res.writeHead(404).end("not found");
          return;
        }
        const got = reqUrl.searchParams.get("code");
        const gotState = reqUrl.searchParams.get("state");
        if (gotState !== state) {
          res.writeHead(400).end("state mismatch");
          server.close();
          reject(new Error("OAuth state mismatch"));
          return;
        }
        if (!got) {
          res.writeHead(400).end("missing code");
          server.close();
          reject(new Error("missing code in callback"));
          return;
        }
        res.writeHead(200, { "content-type": "text/html" }).end(
          "<html><body style=\"font-family:sans-serif;padding:3rem\"><h2>✓ Authorized</h2><p>You can close this tab and return to the terminal.</p></body></html>",
        );
        server.close();
        resolve(got);
      } catch (e) {
        reject(e as Error);
      }
    });
    server.listen(CALLBACK_PORT, "127.0.0.1");
  });

  console.log("Exchanging code for tokens...");
  const { accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: CALLBACK_URL,
  });

  if (!refreshToken) {
    throw new Error("X did not return a refresh token. Make sure 'offline.access' scope is enabled on your app.");
  }

  writeTokens({
    accessToken,
    refreshToken,
    expiresAt: Date.now() + (expiresIn ?? 7200) * 1000,
  });
  console.log("✓ Tokens saved to .x-tokens.json (gitignored).");
}
