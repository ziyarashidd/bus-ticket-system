import type { Metadata } from "next";
import "@fontsource/geist-sans";     // loads Geist Sans
import "@fontsource/geist-sans/400.css"; // optional specific weight
import "@fontsource/geist-mono";     // loads Geist Mono
import "@fontsource/geist-mono/400.css"; // optional specific weight
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Print-Yatri - Bus Ticketing System",
  description: "Created with ziya rashid",
  generator: "ziyarashid",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
