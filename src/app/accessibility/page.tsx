import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AccessibilityStatementPage() {
  return (
    <div className="pt-28 pb-24 px-6 max-w-3xl mx-auto space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Accessibility Statement</h1>
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 text-xs text-zinc-600 leading-relaxed space-y-4">
        <p>
          VeriSpec Intel is engineered to meet WCAG 2.2 AA accessibility guidelines.
          Our UI features high-contrast typographic ratios, keyboard navigational focus states, semantic HTML landmarks, and screen-reader accessible form controls.
        </p>
      </div>
    </div>
  );
}
