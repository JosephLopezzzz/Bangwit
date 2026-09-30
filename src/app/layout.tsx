import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { BangwitProvider } from "@/components/bangwit-provider";
import { SerwistProvider } from "@serwist/turbopack/react";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Bangwit",
  title: "Bangwit — Bawat huli, may kuwento.",
  description: "Kilalanin ang mga yamang-tubig at itala ang mga huli mo.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Bangwit",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f8f7",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tl">
      <body>
        <SerwistProvider swUrl="/serwist/sw.js">
          <BangwitProvider>
            <AppHeader />
            {children}
          </BangwitProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
