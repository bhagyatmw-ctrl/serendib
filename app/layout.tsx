import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serendib | Your Sri Lanka Travel Companion",
  description: "Discover, plan, and experience an unforgettable journey across Sri Lanka.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
