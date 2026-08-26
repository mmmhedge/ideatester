import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROOF — not generated, printed",
  description:
    "A running paper record of things people actually made. No AI. Submit work, propose a topic, watch the roll grow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="topbar">
          <div>
            <Link href="/" className="wordmark">
              PROOF
            </Link>
            <div className="tagline">not generated — printed, by hand, on paper</div>
          </div>
          <nav className="links">
            <Link href="/submit">submit</Link>
            <Link href="/admin">admin</Link>
          </nav>
        </div>
        {children}
        <footer className="site">
          proof · one paper, added to by hand · turned on when there&apos;s something new
        </footer>
      </body>
    </html>
  );
}
