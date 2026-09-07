import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="pt-28 pb-24 px-6 max-w-3xl mx-auto space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Terms of Service</h1>
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 text-xs text-zinc-600 leading-relaxed space-y-4">
        <p>
          By accessing VeriSpec Intel, you acknowledge that this platform provides product information and inventory intelligence for reference purposes only.
        </p>
        <h3 className="font-bold text-zinc-900 text-sm">Non-Store Agreement</h3>
        <p>
          You acknowledge that no contract of sale is concluded on this website. Any purchase undertaken via an external link is executed solely between you and the designated third-party supplier.
        </p>
      </div>
    </div>
  );
}
