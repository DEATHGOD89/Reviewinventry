"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Box,
  Info,
  Warehouse,
  FileText,
  Beaker,
  AlertTriangle,
  SlidersHorizontal,
  Eye,
  ShieldAlert,
  Award,
} from "lucide-react";

interface ShowcaseProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  sku: string;
  warehouseLocation: string;
  stockUnits: number;
  standard: string;
  image: string;
  badge: string;
  indicativePriceInr: number;
  hotspots: {
    label: string;
    standard: string;
    x: string;
    y: string;
  }[];
  angles: {
    title: string;
    note: string;
  }[];
}

const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: "respirator",
    slug: "full-face-chemical-respirator",
    name: "Full-Face Chemical Respirator",
    category: "Respiratory & Gas Protection",
    sku: "VS-PPE-020",
    warehouseLocation: "WH-MAIN-01 • Zone B-02",
    stockUnits: 840,
    standard: "EN 136:1998 / NIOSH TC-84A",
    image: "/images/hero_respirator.jpg",
    badge: "Chemical Vapor & Particle Barrier",
    indicativePriceInr: 3850,
    hotspots: [
      { label: "Anti-Fog Polycarbonate Visor", standard: "EN 166 Class 1 Optical & Impact", x: "48%", y: "30%" },
      { label: "Dual Organic Vapor & Acid Gas Filters", standard: "A1B1E1K1-P3 Certified Rating", x: "28%", y: "65%" },
      { label: "Hypoallergenic Silicone Seal", standard: "Hermetic Face Seal & Negative Pressure", x: "65%", y: "72%" },
    ],
    angles: [
      { title: "Front Inspection", note: "Dual-cartridge containment check" },
      { title: "Seal Profile", note: "Hypoallergenic silicone perimeter" },
      { title: "Filter Matrix", note: "Organic vapor / acid gas barrier" },
    ],
  },
  {
    id: "helmet",
    slug: "cap",
    name: "High-Impact Safety Visor Helmet",
    category: "Head & Face Impact Defense",
    sku: "VS-PPE-001",
    warehouseLocation: "WH-MAIN-01 • Bin A-14",
    stockUnits: 1250,
    standard: "ANSI/ISEA Z89.1 Type 1 Class E",
    image: "/images/hero_helmet.jpg",
    badge: "Mechanical Shock & Arc Flash Barrier",
    indicativePriceInr: 1850,
    hotspots: [
      { label: "High-Density Polyethylene Shell", standard: "EN 397 Lateral Deformation Tested", x: "48%", y: "20%" },
      { label: "Integrated Flip-Down Visor", standard: "ANSI Z87.1+ High-Velocity Protection", x: "46%", y: "54%" },
      { label: "4-Point Ratchet Suspension", standard: "Kinetic Shock Absorption Harness", x: "68%", y: "65%" },
    ],
    angles: [
      { title: "Front Visor", note: "High-velocity ballistic optical shield" },
      { title: "Crown Stress", note: "Top-impact kinetic dispersion" },
      { title: "Suspension Harness", note: "Micro-adjustable ergonomic cradle" },
    ],
  },
  {
    id: "gloves",
    slug: "nitrile-gloves",
    name: "Heavy-Duty Chemical Barrier Gloves",
    category: "Hand & Forearm Chemical Protection",
    sku: "VS-PPE-005",
    warehouseLocation: "WH-MAIN-01 • Bin C-08",
    stockUnits: 4300,
    standard: "EN ISO 374-1:2016 Type A (AJKLPT)",
    image: "/images/hero_gloves.jpg",
    badge: "Solvent, Acid & Caustic Barrier",
    indicativePriceInr: 420,
    hotspots: [
      { label: "Textured Diamond Grip", standard: "Wet/Oily Hydrocarbon Dexterity", x: "53%", y: "22%" },
      { label: "Permeation Pressure Testing", standard: "AQL 0.65 Pinhole Leak Inspection", x: "32%", y: "52%" },
      { label: "Extended 300mm Forearm Cuff", standard: "Splash & Immersion Protection", x: "74%", y: "64%" },
    ],
    angles: [
      { title: "Permeation Rig", note: "Hydrostatic pinhole leak telemetry" },
      { title: "Grip Micro-Structure", note: "Tactile diamond embossing" },
      { title: "Gauntlet Cuff", note: "Forearm splash immersion overlap" },
    ],
  },
  {
    id: "hazardous",
    slug: "caustic-soda",
    name: "Hazardous Chemical Containment",
    category: "Chemical Storage & Spill Control",
    sku: "VS-CHM-011",
    warehouseLocation: "WH-HAZMAT-02 • Spill Bay 1",
    stockUnits: 180,
    standard: "UN GHS Hazard Class 8 (Corrosive)",
    image: "/images/hero_hazardous.jpg",
    badge: "Secondary Containment & Spill Sump",
    indicativePriceInr: 1250,
    hotspots: [
      { label: "Corrosion-Proof Storage Drums", standard: "UN 1H1/X1.8/250 Heavy Containment", x: "34%", y: "45%" },
      { label: "High-Visibility Spill Sump Pallet", standard: "EPA 40 CFR 264.175 Compliant", x: "38%", y: "82%" },
      { label: "GHS Hazard Identification Labels", standard: "Mandatory SDS Verification Gate", x: "55%", y: "58%" },
    ],
    angles: [
      { title: "Spill Bay Overview", note: "Forklift accessible containment pallet" },
      { title: "GHS Label Audit", note: "Class 8 corrosive hazard compliance" },
      { title: "Ventilation Sump", note: "Vapor extraction containment" },
    ],
  },
];

export const HeroShowcase: React.FC = () => {
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(0);
  const [activeAngleIdx, setActiveAngleIdx] = useState<number>(0);
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);

  const product = SHOWCASE_PRODUCTS[selectedProductIdx];

  return (
    <section className="relative pt-32 pb-16 px-4 md:px-6 overflow-hidden">
      {/* Editorial Platform Branding Header */}
      <div className="max-w-6xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold mb-5 shadow-sm border border-zinc-700">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wide">VERIFIED SAFETY & PRODUCT INTELLIGENCE PLATFORM</span>
          <span className="hidden sm:inline text-zinc-400">&bull;</span>
          <span className="hidden sm:inline text-zinc-300 font-mono text-[11px]">ZERO FABRICATED CLAIMS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-zinc-950 uppercase leading-[0.98] max-w-5xl mx-auto">
          Know Before{" "}
          <span className="text-zinc-400 block sm:inline font-bold">You Use.</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-zinc-800 font-semibold max-w-3xl mx-auto leading-relaxed">
          &ldquo;Before you buy, use, store, or trust a product—know whether its information is verified.&rdquo;
        </p>

        <p className="mt-2 text-xs sm:text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          The unified specification registry, warehouse stock telemetry, and Digital Product Passport platform for consumers, factories, offices, hotels, hospitals, schools, cleaning crews & safety managers.
        </p>

        {/* Quick Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          <Link
            href="/products"
            className="px-4 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-2"
          >
            <span>Browse Master Catalogue (19 Items)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/management"
            className="px-4 py-2 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold transition-all border border-zinc-200 shadow-xs flex items-center gap-1.5"
          >
            <Warehouse className="w-3.5 h-3.5 text-zinc-600" />
            <span>Warehouse Stock Balances</span>
          </Link>
          <Link
            href="/safety"
            className="px-4 py-2 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold transition-all border border-zinc-200 shadow-xs flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-600" />
            <span>Safety Data Sheets (SDS)</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Showcase Canvas */}
      <div className="max-w-6xl mx-auto relative rounded-[2.5rem] bg-gradient-to-b from-zinc-100 via-zinc-150 to-zinc-200/80 p-4 sm:p-8 md:p-10 border border-zinc-300/80 shadow-inner">
        {/* Equipment Selector Tabs */}
        <div className="relative z-10 flex flex-col items-center mb-6">
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2.5">
            Select Flagship Industrial Safety Asset
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white/95 border border-zinc-200/90 shadow-sm max-w-full">
            {SHOWCASE_PRODUCTS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedProductIdx(idx);
                  setActiveAngleIdx(0);
                  setHoveredHotspot(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  selectedProductIdx === idx
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <span>{item.name}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    selectedProductIdx === idx ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {item.sku}
                </span>
              </button>
            ))}
          </div>

          {/* Angle / Telemetry Toggle Sub-Buttons */}
          <div className="flex items-center gap-2 mt-4">
            {product.angles.map((angle, idx) => (
              <button
                key={angle.title}
                onClick={() => setActiveAngleIdx(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeAngleIdx === idx
                    ? "bg-zinc-900 text-white shadow-xs font-semibold"
                    : "bg-white/90 text-zinc-700 border border-zinc-200 hover:bg-white"
                }`}
              >
                {angle.title}
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry & Compliance Verification Cards (Non-Overlapping Responsive Grid) */}
        <div className="relative z-10 w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {/* Card 1: Real-Time Warehouse Telemetry */}
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-sm flex items-start gap-3 transition-all hover:border-zinc-300">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Warehouse className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-950">Live Stock Telemetry</span>
                <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  100% Audit-Logged
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1 leading-snug">
                All movements in <strong className="text-zinc-900 font-mono">{product.warehouseLocation}</strong> require recorded justification.
              </p>
              <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200 inline-block font-semibold">
                Available: <span className="text-emerald-700 font-bold">{product.stockUnits.toLocaleString()} units</span>
              </div>
            </div>
          </div>

          {/* Card 2: Zero-Hallucination Policy Gate */}
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-sm flex items-start gap-3 transition-all hover:border-zinc-300">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-950">Zero-Hallucination Policy</span>
                <span className="text-[9px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Strict Verification Gate
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1 leading-snug">
                Chemical hazards and standards are never assumed. Unverified items remain strictly labeled <strong className="text-zinc-900">DRAFT</strong>.
              </p>
              <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 inline-block font-semibold">
                Standard: <span className="font-bold">{product.standard}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Central High-Definition Equipment Showcase Stage */}
        <div className="relative z-10 flex flex-col items-center justify-center">

          {/* Main Equipment Image Stage Card */}
          <div className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-800/20 bg-zinc-950 group">
            {/* High-Resolution Industrial Equipment Photo */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />

            {/* Subtle Gradient Overlays for High-Tech Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 via-transparent to-zinc-950/30 pointer-events-none" />

            {/* Corner Industrial Telemetry Brackets */}
            <div className="absolute top-4 left-4 text-[10px] font-mono text-white/70 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              HUD &bull; {product.angles[activeAngleIdx].note}
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TELEMETRY ACTIVE</span>
            </div>

            {/* Interactive Hotspot Pins */}
            {product.hotspots.map((hotspot, idx) => (
              <div
                key={hotspot.label}
                style={{ left: hotspot.x, top: hotspot.y }}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  onClick={() => setHoveredHotspot(hoveredHotspot === idx ? null : idx)}
                  onMouseEnter={() => setHoveredHotspot(idx)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                  className="relative group/pin focus:outline-none"
                  aria-label={hotspot.label}
                >
                  <span className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover/pin:scale-125">
                    {idx + 1}
                  </div>

                  {/* Hotspot Tooltip */}
                  {hoveredHotspot === idx && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-52 p-2.5 rounded-xl bg-zinc-950/95 backdrop-blur-md text-white border border-white/20 shadow-2xl z-40">
                      <div className="text-[11px] font-bold text-amber-300">{hotspot.label}</div>
                      <div className="text-[10px] text-zinc-300 font-mono mt-0.5">{hotspot.standard}</div>
                    </div>
                  )}
                </button>
              </div>
            ))}

            {/* Bottom Floating Telemetry Overlay */}
            <div className="absolute bottom-4 inset-x-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-20">
              <div className="p-3 sm:p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-white max-w-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    {product.sku}
                  </span>
                  <span className="text-xs text-zinc-300 font-mono">{product.warehouseLocation}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">{product.name}</h3>
                <p className="text-[11px] text-zinc-300 mt-0.5 font-mono">
                  Certification: <strong className="text-white">{product.standard}</strong>
                </p>
              </div>

              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold shadow-xl transition-all hover:gap-3 shrink-0"
              >
                <span>Inspect Full Specs & Stock</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Lower Row: Floating Dark Card (Left) + Live Statistics (Right) */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-8">
          {/* Floating Dark Card - Visora Style */}
          <div className="md:col-span-2 p-6 md:p-8 rounded-3xl bg-[#0d0d11]/95 backdrop-blur-xl text-white border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Enterprise Verification Infrastructure
              </span>
              <span className="text-xs text-zinc-500">&bull;</span>
              <span className="text-[11px] text-zinc-400 font-mono">Non-E-Commerce Platform</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Traceable product specifications, chemical hazard gates, and physical inventory control.
            </h3>
            <p className="mt-2 text-xs md:text-sm text-zinc-400 leading-relaxed max-w-xl">
              Engineered specifically for plant safety officers, EHS directors, and inventory controllers. We do not sell items or process payments. All external purchase references link directly to verified manufacturer distributors.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs shadow-lg hover:bg-zinc-100 transition-all group"
              >
                <span>Explore 19 Master Products</span>
                <div className="w-5 h-5 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>

              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors border border-white/10"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Compare Specs Side-by-Side</span>
              </Link>

              <Link
                href="/management"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors border border-white/10"
              >
                <Warehouse className="w-3.5 h-3.5" />
                <span>Management Portal</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Key Operational Statistics & Live Mini Card */}
          <div className="flex flex-col gap-4">
            {/* Stats Counter 1 */}
            <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-3xl font-black tracking-tight text-zinc-950">19</div>
                <div className="text-xs text-zinc-600 font-medium">Initial Master Products</div>
              </div>
              <div className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-bold border border-zinc-200">
                10 PPE &bull; 9 Chem
              </div>
            </div>

            {/* Stats Counter 2 */}
            <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-3xl font-black tracking-tight text-zinc-950">100%</div>
                <div className="text-xs text-zinc-600 font-medium">Audit-Logged Stock Moves</div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Immutable</span>
              </div>
            </div>

            {/* Mini Product Pill - Quick Access */}
            <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-200 shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">{product.name}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{product.sku} &bull; ₹{product.indicativePriceInr}</div>
                </div>
              </div>
              <Link
                href={`/products/${product.slug}`}
                className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"
                title="View product details"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Safety & Regulatory Standards Ticker */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-zinc-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 shrink-0">
            Regulated Verification Standards:
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-600 font-medium">
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-mono">
              🛡️ OSHA 1910.134 Respiratory
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-mono">
              🧪 EN ISO 374-1 Chemical Barrier
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-mono">
              👁️ ANSI/ISEA Z87.1 Impact Eye
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-mono">
              📑 UN GHS 16-Section SDS
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-mono">
              🏢 ISO 45001 Health & Safety
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
