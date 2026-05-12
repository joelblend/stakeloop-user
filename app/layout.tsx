import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import VisitorTracker from "@/components/analytics/visitor-tracker";

export const metadata: Metadata = {
  title: "Stakeloop User",
  description:
    "Stakeloop member experience for transparent pooled bankroll participation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <VisitorTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
