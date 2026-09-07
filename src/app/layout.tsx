import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomerCareBot } from "@/components/support/CustomerCareBot";

export const metadata: Metadata = {
  title: "VeriSpec | Verified Industrial Inventory & Trusted Review Intelligence",
  description:
    "High-traffic inventory management, trusted product review, and safety compliance platform. 19 initial master products across PPE, chemicals, and waste containment.",
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
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#f7f7f9] text-zinc-900 selection:bg-zinc-900 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CustomerCareBot />
      </body>
    </html>
  );
}
