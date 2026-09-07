"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { ProductItem } from "@/lib/catalog-data";
import {
  ShieldAlert,
  ShieldCheck,
  Beaker,
  FileText,
  Printer,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

interface HazardScenario {
  id: string;
  title: string;
  hazardClass: string;
  icon: string;
  description: string;
  regulatoryStandard: string;
  requiredProductSkus: string[];
  handlingDirectives: string[];
}

const HAZARD_SCENARIOS: HazardScenario[] = [
  {
    id: "corrosive-alkali",
    title: "Class 8 Corrosive Alkalis & Acid Wash",
    hazardClass: "GHS Class 8 Corrosive",
    icon: "🧪",
    description:
      "Operations involving Caustic Soda (Sodium Hydroxide), Suma Det., industrial drain descalers, and strong caustic cleaning agents. Severe chemical burn and eye vapor risk.",
    regulatoryStandard: "OSHA 1910.132 / EN ISO 374 Type A / EN 166 Splash",
    requiredProductSkus: ["VS-PPE-005", "VS-PPE-020", "VS-PPE-001"],
    handlingDirectives: [
      "Mandatory 0.38mm+ heavy-duty nitrile chemical barrier gloves (EN ISO 374-1 Type A).",
      "Full-face negative-pressure respirator with A1B1E1K1 dual gas & vapor cartridges.",
      "Secondary containment spill berm or sump pallet holding 110% of container volume.",
      "Emergency eye-wash station within 10 seconds of mixing station.",
    ],
  },
  {
    id: "heavy-dust-vapor",
    title: "Airborne Chemical Vapor & Toxic Particulates",
    hazardClass: "Respiratory Hazard & Aerosol",
    icon: "💨",
    description:
      "Solvent decanting, powder blending, chemical spray cleaning, and enclosed space ventilation maintenance with high aerosol concentrations.",
    regulatoryStandard: "NIOSH 42 CFR 84 / EN 14387 / EN 149",
    requiredProductSkus: ["VS-PPE-020", "VS-PPE-001", "VS-PPE-005"],
    handlingDirectives: [
      "Hermetic full-face mask with anti-fog optical polycarbonate visor.",
      "Negative pressure differential seal test prior to zone entry.",
      "Filter replacement required after 40 hours cumulative vapor exposure.",
      "Continuous airborne vapor PPM monitoring with audible alarm.",
    ],
  },
  {
    id: "mechanical-impact",
    title: "High-Velocity Impact & Ballistic Drop Hazard",
    hazardClass: "Mechanical Shock (Class E)",
    icon: "⚡",
    description:
      "Warehouse forklift staging, rack loading, heavy tool rigging, scrap metal processing, and overhead pipe maintenance.",
    regulatoryStandard: "ANSI/ISEA Z89.1 Type 1 Class E / EN 397 / EN 388 (4543)",
    requiredProductSkus: ["VS-PPE-001", "VS-PPE-005"],
    handlingDirectives: [
      "High-density dielectric polyethylene shell helmet rated up to 20,000 Volts.",
      "Integrated ballistic flip-down optical visor for lateral chip protection.",
      "Abrasion and cut-resistant mechanical grip gloves.",
      "200-Joule toe cap safety footwear required in loading bays.",
    ],
  },
  {
    id: "cleanroom-hygiene",
    title: "Aseptic Processing & Cleanroom Hygiene",
    hazardClass: "Particulate & Bio-Barrier",
    icon: "🧼",
    description:
      "Cleanroom pharmaceutical packaging, electronics assembly, sensitive surface sanitation, and biological barrier control.",
    regulatoryStandard: "ISO 14644-1 Class 5 / AQL 1.5 Medical Barrier",
    requiredProductSkus: ["VS-PPE-005"],
    handlingDirectives: [
      "Powder-free, low-extractable nitrile gloves (AQL 1.5 barrier integrity).",
      "Lint-free antistatic headcover and disposable containment smock.",
      "Strict surface disinfection with verified hospital-grade surfactant.",
      "Single-use protocol with zero glove re-donning.",
    ],
  },
];

export const HazardProtocolWizard: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("corrosive-alkali");
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const allProducts = getAllDynamicProducts();

  const currentScenario =
    HAZARD_SCENARIOS.find((s) => s.id === selectedScenarioId) || HAZARD_SCENARIOS[0];

  const matchedProducts = currentScenario.requiredProductSkus
    .map((sku) => allProducts.find((p) => p.sku === sku))
    .filter((p): p is ProductItem => !!p);

  const totalBundleCost = matchedProducts.reduce(
    (sum, p) => sum + p.indicativePriceInr,
    0
  );

  const compareUrl = `/compare?${matchedProducts
    .map((p, idx) => `p${idx + 1}=${p.slug}`)
    .join("&")}`;

  return (
    <div className="rounded-3xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
      {/* Wizard Header */}
      <div className="p-6 md:p-8 bg-zinc-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/30">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Automated Compliance Engine &bull; Zero Guesswork</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Hazard-to-PPE Protocol Advisor
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Select your plant operation or chemical risk to automatically generate the certified equipment bundle required under OSHA and EN safety standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPrintModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-all shadow-md shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Compliance Protocol</span>
          </button>
        </div>
      </div>

      {/* Step 1: Scenario Selector Cards */}
      <div className="p-6 md:p-8 border-b border-zinc-100 bg-[#f9f9fb]">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Step 1: Select Hazardous Plant Activity
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HAZARD_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-zinc-950 ring-2 ring-zinc-950 shadow-md"
                    : "bg-white/80 border-zinc-200 hover:border-zinc-300 hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{sc.icon}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? "bg-zinc-950 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {sc.hazardClass.split(" ")[0]}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 leading-snug">
                    {sc.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1">
                    {sc.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 text-[10px] text-cyan-800 font-semibold">
                  {isSelected ? "Active Selection ✓" : "Click to Inspect"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Matched Certified Equipment Bundle */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                {currentScenario.hazardClass}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Req: {currentScenario.regulatoryStandard}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-zinc-950 mt-1">
              {currentScenario.title} &bull; Required Equipment Package
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-zinc-400">
                Bundle Indicative Ref
              </div>
              <div className="text-base font-black text-zinc-950">
                ₹{totalBundleCost.toFixed(2)} INR
              </div>
            </div>

            <Link
              href={compareUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Compare Bundle</span>
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matchedProducts.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#fafafc] border border-zinc-200 flex flex-col justify-between hover:border-zinc-300 transition-all"
            >
              <div>
                <div className="w-full h-36 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-3 relative">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                      Photo Pending
                    </div>
                  )}
                  <span className="absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/75 text-white font-bold">
                    {p.sku}
                  </span>
                </div>

                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                  {p.categoryName}
                </span>
                <h4 className="text-sm font-bold text-zinc-900 leading-snug mt-0.5">
                  {p.name}
                </h4>
                <p className="text-[11px] text-zinc-600 line-clamp-2 mt-1 leading-relaxed">
                  {p.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-900">
                  ₹{p.indicativePriceInr.toFixed(2)} ref
                </span>
                <Link
                  href={`/products/${p.slug}`}
                  className="text-xs font-bold text-cyan-800 hover:text-cyan-950 flex items-center gap-1"
                >
                  <span>Specs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Operating Directives Checklist */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mandatory Field Handling Checklist (VeriSpec Audit Protocol)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-700">
            {currentScenario.handlingDirectives.map((dir, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white border border-zinc-200 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-emerald-200">
                  {i + 1}
                </span>
                <span className="leading-snug text-zinc-600 text-[11px]">{dir}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Printable Compliance Requisition Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-zinc-200 shadow-2xl p-8 space-y-6 my-8 print:m-0 print:border-none print:shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Official Compliance Requisition Sheet
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-900"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-zinc-900">
              <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-4">
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    VERISPEC INDUSTRIAL SAFETY COMPLIANCE REQUISITION
                  </h3>
                  <div className="text-xs text-zinc-500 font-mono">
                    Hazard Classification: {currentScenario.hazardClass}
                  </div>
                </div>
                <div className="text-right text-xs font-mono">
                  <div>DOC-REQ-{Date.now().toString().slice(-6)}</div>
                  <div className="text-zinc-500">
                    {new Date().toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong>Target Operational Scenario:</strong> {currentScenario.title}
                </div>
                <div>
                  <strong>Governing Standards:</strong> {currentScenario.regulatoryStandard}
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-zinc-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 font-mono text-[11px]">
                    <tr>
                      <th className="p-2">SKU</th>
                      <th className="p-2">Equipment Description</th>
                      <th className="p-2 text-right">Indicative Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 font-mono text-[11px]">
                    {matchedProducts.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 font-bold">{p.sku}</td>
                        <td className="p-2">{p.name}</td>
                        <td className="p-2 text-right">
                          ₹{p.indicativePriceInr.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-zinc-50 font-bold">
                      <td colSpan={2} className="p-2 text-right">
                        Total Estimated Requisition:
                      </td>
                      <td className="p-2 text-right">
                        ₹{totalBundleCost.toFixed(2)} INR
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Directives */}
              <div className="space-y-1 text-xs">
                <strong>Mandatory Field Operating Directives:</strong>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-zinc-600">
                  {currentScenario.handlingDirectives.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-[11px] text-zinc-500 border-t border-zinc-200">
                <div>
                  <div className="border-b border-zinc-400 pb-8 mb-1"></div>
                  <span>Plant Safety Officer Signature / Date</span>
                </div>
                <div>
                  <div className="border-b border-zinc-400 pb-8 mb-1"></div>
                  <span>Warehouse Procurement Approval / Date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
