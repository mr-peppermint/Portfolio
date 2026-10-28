import type { Metadata, Viewport } from "next";
import { portfolio } from "@/lib/content";
import { SkipLink, ScrollProgress, Grain, CustomCursor } from "@/components/Chrome";
import RevealProvider from "@/components/RevealProvider";
import MotionEffects from "@/components/MotionEffects";

import "./globals.css";

export const metadata: Metadata = {
  title: `${portfolio.name} — ${portfolio.role}`,
  description: `Portfolio of ${portfolio.name} — creative developer building fast, tactile interfaces where motion is a material, not decoration.`,
  openGraph: {
    type: "website",
    title: `${portfolio.name} — ${portfolio.role}`,
    description: "Fast, tactile interfaces built with intent. Selected work, credentials, and open source.",
  },
  icons: { icon: [{ url: "/favicon.svg" }] },
};

export const viewport: Viewport = {
  themeColor: "#070808",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        <ScrollProgress />
        <Grain />
        <CustomCursor />
        {children}
        <RevealProvider />
        <MotionEffects />
      </body>
    </html>
  );
}
