import React from "react";
import { ShieldAlert, AlertTriangle, FileCheck, CheckCircle2, Lock } from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="pt-28 pb-24 px-6 max-w-4xl mx-auto space-y-10">
      <div className="pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
          <span>Mandatory Safety Notice</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
          Safety Protocols & Platform Disclaimers
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1 leading-relaxed">
          Critical guidelines governing chemical handling, personal protective equipment usage, and verification thresholds.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-3">
        <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Non-E-Commerce Platform Declaration</span>
        </h2>
        <p className="text-xs text-amber-900 leading-relaxed">
          VeriSpec is strictly an inventory management, product information, and trusted review platform.
          <strong> Users cannot purchase goods, place orders, or submit payments on this platform.</strong> All
          purchase buttons strictly redirect to verified external suppliers and marketplaces in a new tab.
        </p>
      </div>

      <div className="space-y-6 text-xs text-zinc-700 leading-relaxed">
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-2">
          <h3 className="text-sm font-bold text-zinc-900">1. Chemical Data & SDS Verification Rule</h3>
          <p>
            Chemical products such as Caustic Soda, Suma Det., and other cleaning chemicals require verified manufacturer Safety Data Sheets (SDS) before any safety claims or hazard classifications are confirmed. In the initial product master, all chemical properties are seeded explicitly as &ldquo;Requires manufacturer SDS/label verification&rdquo;.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-2">
          <h3 className="text-sm font-bold text-zinc-900">2. PPE Standards Documentation</h3>
          <p>
            Never assume a piece of personal protective equipment complies with EN ISO or ASTM standards without viewing the certified laboratory certificate. VeriSpec marks all unverified standards as pending until confirmed by management.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-2">
          <h3 className="text-sm font-bold text-zinc-900">3. Indicative Pricing Disclaimer</h3>
          <p>
            All prices shown are approximate reference prices provided in Indian Rupees (INR) and converted using static indicative exchange rates. Prices vary widely based on regional taxes, logistics, order volume, and supplier terms.
          </p>
        </div>
      </div>
    </div>
  );
}
