import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomerCareBot } from "@/components/support/CustomerCareBot";
import { OfflineStatusBar } from "@/components/ui/OfflineStatusBar";
import { NetlifyBadgeRemover } from "@/components/ui/NetlifyBadgeRemover";

export const metadata: Metadata = {
  title: "VeriSpec | Verified Industrial Inventory & Trusted Review Intelligence",
  description:
    "High-traffic inventory management, trusted product review, and safety compliance platform. 19 initial master products across PPE, chemicals, and waste containment.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "168x168", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  keywords: [
    "industrial inventory",
    "PPE verification",
    "chemical safety",
    "SDS verification",
    "nitrile gloves",
    "caustic soda",
    "product reviews",
    "ISO compliance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-indigo-600 selection:text-white">
        <OfflineStatusBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CustomerCareBot />
        <NetlifyBadgeRemover />
      </body>
    </html>
  );
}
