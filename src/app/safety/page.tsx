"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Lock,
  Beaker,
  Layers,
  ArrowRight,
  ExternalLink,
  Shield,
  HelpCircle,
  Eye,
  AlertOctagon,
} from "lucide-react";
import { HazardProtocolWizard } from "@/components/safety/HazardProtocolWizard";

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState<"policy" | "ghs" | "ppe" | "spill">("policy");

  const ghsClasses = [
    {
      code: "GHS05",
      name: "Corrosive Substances (Class 8)",
      hazard: "Causes severe skin burns and serious eye damage. Corrosive to metals.",
      examples: "Caustic Soda (Sodium Hydroxide), Suma Det., Concentrated Alkalis",
      protocol: "Secondary containment required. Splash goggles (EN 166) + Nitrile/Neoprene barrier (EN ISO 374).",
      color: "bg-red-50 border-red-200 text-red-900",
    },
    {
      code: "GHS02",
      name: "Flammable & Combustible Liquids (Class 3)",
      hazard: "Flammable vapor and liquid; fire hazard upon ignition source exposure.",
      examples: "Industrial degreasers, solvent thinners, alcohol formulations",
      protocol: "Flame-proof grounding clamps, explosion-proof ventilation, positive pressure storage.",
      color: "bg-amber-50 border-amber-200 text-amber-900",
    },
    {
      code: "GHS07",
      name: "Harmful & Irritant Agents",
      hazard: "May cause respiratory irritation, allergic skin reaction, or drowsiness.",
      examples: "Disinfectant concentrates, aerosol cleaners, active particulate dust",
      protocol: "Cartridge respirators (NIOSH TC-84A) and disposable examination gloves.",
      color: "bg-yellow-50 border-yellow-200 text-yellow-900",
    },
    {
      code: "GHS09",
      name: "Aquatic & Environmental Hazards",
      hazard: "Toxic to aquatic life with long-lasting ecological effects upon runoff.",
      examples: "Bulk sanitation effluent, industrial biocides, degreasing wash water",
      protocol: "Zero-drainage sumps. Sorbent boom isolation prior to neutralization.",
      color: "bg-blue-50 border-blue-200 text-blue-900",
    },
  ];

  const ppeMatrix = [
    {
      material: "Heavy-Duty Nitrile (0.38mm)",
      standard: "EN ISO 374-1 Type A (AQL 1.5)",
      recommendedFor: "Alkalis (Caustic Soda), oils, greases, petrochemicals",
      notRecommended: "Ketones (Acetone), concentrated oxidizing acids",
    },
    {
      material: "Butyl Rubber (0.50mm)",
      standard: "EN 374 / ASTM F739",
      recommendedFor: "Ketones, esters, highly volatile gas atmospheres",
      notRecommended: "Aliphatic hydrocarbons, petroleum fuels",
    },
    {
      material: "Neoprene Synthetic Elastomer",
      standard: "EN 388 (3121) / EN 374",
      recommendedFor: "Acids, alcohols, detergents, moderate alkalis",
      notRecommended: "Aromatic hydrocarbons, chlorinated solvents",
    },
    {
      material: "Natural Latex Rubber",
      standard: "EN 455 / EN 374",
      recommendedFor: "Biological fluids, water-soluble dilute cleaning agents",
      notRecommended: "Oils, fuels, organic solvents (causes degradation)",
    },
  ];

  return (
    <div className="pt-28 pb-24 px-6 max-w-5xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
          <span>Mandatory Industrial Safety Notice</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
          Safety Protocols & Platform Governance
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1 leading-relaxed max-w-2xl">
          Authoritative operating procedures governing personal protective equipment, chemical handling protocols, GHS hazard classifications, and platform transparency.
        </p>
      </div>

      {/* Interactive Compliance Decision Engine */}
      <HazardProtocolWizard />

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3">
        <button
          onClick={() => setActiveTab("policy")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "policy"
              ? "bg-zinc-950 text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Platform Policy & Verification
        </button>
        <button
          onClick={() => setActiveTab("ghs")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "ghs"
              ? "bg-zinc-950 text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          GHS Chemical Classifications
        </button>
        <button
          onClick={() => setActiveTab("ppe")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "ppe"
              ? "bg-zinc-950 text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          PPE Chemical Permeation Matrix
        </button>
        <button
          onClick={() => setActiveTab("spill")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "spill"
              ? "bg-zinc-950 text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Warehouse Spill Response SOP
        </button>
      </div>

      {/* TAB 1: Platform Policy & Non-Store Rules */}
      {activeTab === "policy" && (
        <div className="space-y-6">
          {/* Non-Store Declaration */}
          <div className="p-6 rounded-3xl bg-amber-50/90 border border-amber-200 space-y-3">
            <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <span>Non-E-Commerce Platform Declaration</span>
            </h2>
            <p className="text-xs text-amber-900 leading-relaxed">
              VeriSpec is strictly an inventory intelligence, technical specification registry, and trusted peer review platform.
              <strong> Users cannot purchase goods, checkout, or submit payments on this platform.</strong> All
              external purchase buttons strictly link to authorized external suppliers and marketplaces in a new tab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-700">
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Chemical Data & SDS Rule</span>
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Chemical items such as Caustic Soda, Suma Det., and industrial detergents require verified manufacturer Safety Data Sheets (SDS) before any safety claims or hazard thresholds are confirmed. In the initial product master, all chemical properties remain explicitly marked as &ldquo;Requires manufacturer SDS/label verification&rdquo;.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-600" />
                <span>PPE Laboratory Certifications</span>
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Never assume a piece of personal protective equipment complies with EN ISO or ASTM standards without viewing the certified laboratory certificate. VeriSpec marks unverified standards as pending until confirmed by management in the audit registry.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-700" />
                <span>Role-Based Access & Cryptographic Logs</span>
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Every stock level adjustment, review moderation action, and specification update requires mandatory human justification reasons and is permanently recorded in the immutable audit log for ISO 9001 compliance.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <span>Indicative Pricing Transparency</span>
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                All prices shown are approximate reference prices provided in Indian Rupees (INR) and converted using static indicative exchange rates. Prices vary widely based on logistics, order volume, and supplier terms.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GHS Chemical Classes */}
      {activeTab === "ghs" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-zinc-100 text-xs text-zinc-600 flex items-center justify-between">
            <span>Global Harmonized System (GHS) Hazard Classification Matrix</span>
            <span className="font-mono text-[11px] text-zinc-500">OSHA 29 CFR 1910.1200</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ghsClasses.map((item) => (
              <div
                key={item.code}
                className={`p-6 rounded-3xl border ${item.color} space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current shadow-2xs">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Hazard Class
                  </span>
                </div>

                <h3 className="text-base font-bold tracking-tight">{item.name}</h3>
                <p className="text-xs leading-relaxed opacity-90">{item.hazard}</p>

                <div className="pt-2 border-t border-current/20 text-xs space-y-1">
                  <div>
                    <strong className="opacity-80">Catalog Examples: </strong>
                    <span>{item.examples}</span>
                  </div>
                  <div>
                    <strong className="opacity-80">Mandatory Protocol: </strong>
                    <span>{item.protocol}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PPE Chemical Permeation Matrix */}
      {activeTab === "ppe" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-zinc-100 text-xs text-zinc-600">
            <strong>EN ISO 374 Chemical Permeation Compatibility Guide:</strong> Match glove barrier elastomer compounds to chemical hazards to avoid breakthrough degradation.
          </div>

          <div className="rounded-3xl bg-white border border-zinc-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-100 text-zinc-700 font-mono text-[11px] border-b border-zinc-200">
                <tr>
                  <th className="p-3.5 font-bold">Glove Material</th>
                  <th className="p-3.5 font-bold">Test Standard</th>
                  <th className="p-3.5 font-bold">Recommended Application</th>
                  <th className="p-3.5 font-bold">Do Not Use With</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {ppeMatrix.map((m) => (
                  <tr key={m.material} className="hover:bg-zinc-50">
                    <td className="p-3.5 font-bold text-zinc-900">{m.material}</td>
                    <td className="p-3.5 font-mono text-zinc-600 text-[11px]">{m.standard}</td>
                    <td className="p-3.5 text-emerald-800">{m.recommendedFor}</td>
                    <td className="p-3.5 text-red-700">{m.notRecommended}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Warehouse Spill Response SOP */}
      {activeTab === "spill" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-950 text-white space-y-4">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold">
                HAZMAT Storage Incident Protocol (WH-HAZMAT-02 / WH-MAIN-01)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standard Operating Procedure for containment breaches involving Class 8 Corrosive or industrial liquid agents.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800 text-xs">
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-mono text-[10px] font-bold">
                  1
                </span>
                <strong className="text-white block">Evacuate & Cordon</strong>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Sound localized alarm. Establish 15-meter safety perimeter downwind.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-mono text-[10px] font-bold">
                  2
                </span>
                <strong className="text-white block">Don Required PPE</strong>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Inspect Caustic Soda SDS. Don full-face respirator & chemical boots.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center font-mono text-[10px] font-bold">
                  3
                </span>
                <strong className="text-white block">Isolate & Neutralize</strong>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Deploy neutralizing sorbent pillows into secondary sump channel.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-mono text-[10px] font-bold">
                  4
                </span>
                <strong className="text-white block">Log Portal Incident</strong>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Record inventory damage in VeriSpec Management Portal with mandatory audit note.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
