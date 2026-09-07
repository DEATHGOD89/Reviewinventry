import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-24 px-6 max-w-3xl mx-auto space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Privacy Policy</h1>
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 text-xs text-zinc-600 leading-relaxed space-y-4">
        <p>
          VeriSpec Intel respects the confidentiality of personal data. We do not track users with invasive third-party ad networks.
        </p>
        <h3 className="font-bold text-zinc-900 text-sm">1. Information Collection</h3>
        <p>
          We only process credentials necessary for account authentication (email, encrypted password) and submitted review feedback.
        </p>
        <h3 className="font-bold text-zinc-900 text-sm">2. Non-Store Data Integrity</h3>
        <p>
          Because VeriSpec does not process purchases or payments, we never collect credit card details, billing addresses, or banking information.
        </p>
      </div>
    </div>
  );
}
