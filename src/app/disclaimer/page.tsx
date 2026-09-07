import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="pt-28 pb-24 px-6 max-w-3xl mx-auto space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Platform Disclaimer & Non-Store Notice</h1>
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 text-xs text-zinc-600 leading-relaxed space-y-4">
        <p>
          VeriSpec Intel is an inventory intelligence and trusted product-review platform. It is <strong>NOT an online store</strong>.
          Users cannot add products to a shopping cart, submit checkout forms, or process financial payments on this website.
        </p>
        <p>
          All product links labelled &ldquo;Buy from external seller&rdquo; will open a new tab directly to authorized third-party supplier domains (such as IndiaMART, Moglix, Amazon, or manufacturer distributor sites). VeriSpec holds no liability for external order fulfillment, merchant disputes, or shipping logistics.
        </p>
      </div>
    </div>
  );
}
