import type { Metadata } from "next";
import "./globals.css";
import VisitorTracker from "@/components/analytics/visitor-tracker";

export const metadata: Metadata = {
  title: "StakeLoop User",
  description:
    "StakeLoop user frontend for transparent pooled bankroll participation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
