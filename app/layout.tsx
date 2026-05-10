import type { Metadata } from "next";
import "./globals.css";
import { ClientTracker } from "@/components/ClientTracker";
import { MetaPixel } from "@/components/MetaPixel";
import { PostHogScript } from "@/components/PostHogScript";
import { PlausibleScript } from "@/components/PlausibleScript";

export const metadata: Metadata = {
  title: "ideatester",
  description: "Spin up landing pages to test ideas fast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MetaPixel />
        <PostHogScript />
        <PlausibleScript />
        <ClientTracker />
        {children}
      </body>
    </html>
  );
}
