"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  HardHat,
  Users,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Star,
  ExternalLink,
  QrCode,
  Languages,
  AlertTriangle,
  FileText,
  Warehouse,
  PlusCircle,
  FileCheck,
  Eye,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCode,
  Activity,
  Check,
} from "lucide-react";

interface RoleExperience {
  id: "customer" | "worker" | "management" | "owner";
  title: "Normal Customer" | "Worker / Employee" | "Management Team" | "Platform Owner";
  badge: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  keyFeatures: { title: string; desc: string }[];
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  mockupSnippet: {
    title: string;
    subtitle: string;
    metrics: { label: string; value: string }[];
    highlightText: string;
  };
}

const EXPERIENCES: RoleExperience[] = [
  {
    id: "customer",
    title: "Normal Customer",
    badge: "Consumer & Procurement",
    tagline: "Unbiased specs, verified reviews, and zero deceptive marketing.",
    description:
      "Search the master catalogue, compare certified safety specs side-by-side, read authentic auditor reviews, and access authorized external supplier channels with transparent pricing.",
    icon: User,
    keyFeatures: [
      {
        title: "Objective Specification Matrix",
        desc: "Compare up to 4 items simultaneously with verified lab attributes and 'Not verified yet' indicators.",
      },
      {
        title: "Transparent Trust Score™ (0-100)",
        desc: "See exactly why a product earns its score across 7 transparent regulatory and verification factors.",
      },
      {
        title: "Non-Store External Buying Links",
        desc: "VeriSpec never takes commissions or marks up prices. Direct links to verified manufacturers and distributors.",
      },
    ],
    primaryAction: { label: "Explore Master Catalogue", href: "/products" },
    secondaryAction: { label: "Compare Products", href: "/compare" },
    mockupSnippet: {
      title: "Full-Face Chemical Respirator",
      subtitle: "Verified Manufacturer Spec • Trust Score: 82/100",
      metrics: [
        { label: "Lab Standard", value: "EN 136:1998" },
        { label: "Confidence", value: "Manufacturer Verified" },
        { label: "Ref Price", value: "₹3,850 INR" },
      ],
      highlightText:
        "“Objective auditor findings confirmed gas permeation barrier. Zero sponsored reviews allowed.”",
    },
  },
  {
    id: "worker",
    title: "Worker / Employee",
    badge: "Floor & Field Safety",
    tagline: "Instant shelf scan, plain-language guidance, and emergency safety.",
    description:
      "Floor staff, cleaners, and warehouse handlers can scan QR/barcodes on bins or packaging to instantly pull up plain-language rules, GHS hazard warnings, and emergency first-aid protocols.",
    icon: HardHat,
    keyFeatures: [
      {
        title: "1-Tap Shelf QR & Barcode Scanner",
        desc: "Instant camera scanner pulls up the exact Digital Product Passport without typing SKU codes.",
      },
      {
        title: "Plain Language / Worker Mode",
        desc: "One-toggle switch translates chemical and PPE technical jargon into simple, everyday safe-use rules.",
      },
      {
        title: "Instant SDS First-Aid Protocols",
        desc: "Immediate access to 16-section GHS safety instructions, spill procedures, and eyewash guidelines.",
      },
    ],
    primaryAction: { label: "Open Safety Centre & Protocols", href: "/safety" },
    secondaryAction: { label: "Scan Shelf Barcode", href: "/management" },
    mockupSnippet: {
      title: "Worker Safe-Use Mode: ACTIVATED",
      subtitle: "Plain Language Directive • Shelf Bin A-14",
      metrics: [
        { label: "Required PPE", value: "Nitrile Gloves + Visor" },
        { label: "Use Rule", value: "Single Shift Only" },
        { label: "First Aid", value: "Flush Eyes 15 Mins" },
      ],
      highlightText:
        "“No chemistry jargon: Do NOT mix with bleach or acids. Wear goggles before opening drum valve.”",
    },
  },
  {
    id: "management",
    title: "Management Team",
    badge: "Operations & Compliance",
    tagline: "Maintain stock levels, generate POs, upload SDS, and moderate reviews.",
    description:
      "Facility heads and inventory managers maintain live warehouse balances with quick intake/dispatch buttons, issue automated purchase orders, and verify safety documents.",
    icon: Users,
    keyFeatures: [
      {
        title: "1-Click Reorder PO Generator",
        desc: "Generate printable, formatted Requisition Orders with supplier details and delivery terms instantly.",
      },
      {
        title: "Fast Stock Telemetry (+10 / -5)",
        desc: "Rapid mobile-friendly buttons log intake and dispatch events with full tamper-proof audit trails.",
      },
      {
        title: "Review & Document Moderation",
        desc: "Verify incoming community reviews and validate manufacturer Safety Data Sheets before publishing.",
      },
    ],
    primaryAction: { label: "Open Management Portal", href: "/management" },
    secondaryAction: { label: "Audit Review Queue", href: "/reviews" },
    mockupSnippet: {
      title: "Warehouse Stock Balances",
      subtitle: "Location: WH-MAIN-01 • Zone B-02",
      metrics: [
        { label: "Current Balance", value: "840 Units" },
        { label: "Reorder Trigger", value: "100 Units" },
        { label: "Audit Trail", value: "100% Logged" },
      ],
      highlightText:
        "“PO Requisition #PO-2026-089 generated for 3M Industrial. SDS Renewal Verified.”",
    },
  },
  {
    id: "owner",
    title: "Platform Owner",
    badge: "Governance & Authority",
    tagline: "Total control over specifications, verification, pricing, and suppliers.",
    description:
      "Platform administrators and enterprise owners maintain data verification integrity, approve verified badges, manage external supplier links, and review dispute reports.",
    icon: ShieldCheck,
    keyFeatures: [
      {
        title: "Complete Specification Editing Suite",
        desc: "Update product descriptions, add dynamic custom technical attributes, and modify indicative prices.",
      },
      {
        title: "Verification Authority & Trust Badges",
        desc: "Elevate draft records to 'Verified by Owner' or 'Manufacturer Source' with confidence scores.",
      },
      {
        title: "5-Category Report Resolution Hub",
        desc: "Review user-submitted reports for wrong specs, fake reviews, or missing safety certificates.",
      },
    ],
    primaryAction: { label: "Access Owner Admin Console", href: "/admin" },
    secondaryAction: { label: "Edit Product Specs", href: "/products" },
    mockupSnippet: {
      title: "VeriSpec Owner Authority Console",
      subtitle: "Master Catalog Status: 19 Verified Assets",
      metrics: [
        { label: "Zero-Hallucination", value: "Enforced" },
        { label: "Audit Reports", value: "0 Pending" },
        { label: "Trust Score Engine", value: "v2.4 Active" },
      ],
      highlightText:
        "“Strict Verification Gate Active: Caustic soda and hazardous chemicals locked from unverified claims.”",
    },
  },
];

export const FourExperiencesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RoleExperience["id"]>("customer");

  const currentExp = EXPERIENCES.find((exp) => exp.id === activeTab) || EXPERIENCES[0];
  const IconComponent = currentExp.icon;

  return (
    <section className="py-20 px-4 md:px-6 bg-zinc-950 text-white border-y border-zinc-800">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>FOUR SPECIALIZED EXPERIENCES &bull; ONE UNIFIED PLATFORM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Engineered for Everyone Who Depends on Safety
          </h2>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-normal">
            Whether you are buying for an enterprise, working the factory floor, managing warehouse stocks, or governing compliance—VeriSpec delivers a dedicated interface tailored to your role.
          </p>
        </div>

        {/* 4 Role Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-1.5 bg-zinc-900/90 rounded-3xl border border-zinc-800">
          {EXPERIENCES.map((exp) => {
            const ExpIcon = exp.icon;
            const isSelected = activeTab === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => setActiveTab(exp.id)}
                className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-white text-zinc-950 shadow-xl scale-[1.02]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-zinc-950 text-white" : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    <ExpIcon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{exp.title}</div>
                  <div
                    className={`text-[10px] font-mono mt-0.5 ${
                      isSelected ? "text-zinc-600" : "text-zinc-500"
                    }`}
                  >
                    {exp.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Experience Showcase Card */}
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Role Details & Key Features */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono border border-emerald-500/20">
                  {currentExp.badge}
                </span>
                <span className="text-xs text-zinc-500 font-mono">Role ID: {currentExp.id}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentExp.tagline}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{currentExp.description}</p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              {currentExp.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-white font-bold block">{feat.title}</strong>
                    <span className="text-zinc-400 leading-relaxed">{feat.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800">
              <Link
                href={currentExp.primaryAction.href}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <span>{currentExp.primaryAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {currentExp.secondaryAction && (
                <Link
                  href={currentExp.secondaryAction.href}
                  className="px-5 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-all border border-zinc-700"
                >
                  {currentExp.secondaryAction.label}
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Live Interface Mockup Simulation */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-zinc-500 ml-2">
                    verispec://role/{currentExp.id}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  Active
                </span>
              </div>

              <div>
                <div className="text-xs text-zinc-500 font-mono">Simulated View</div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {currentExp.mockupSnippet.title}
                </h4>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {currentExp.mockupSnippet.subtitle}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2">
                {currentExp.mockupSnippet.metrics.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">{m.label}</div>
                    <div className="text-xs font-bold text-zinc-200 mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Quote / Highlight */}
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-[11px] text-zinc-300 italic">
                {currentExp.mockupSnippet.highlightText}
              </div>

              <div className="pt-2 text-[10px] font-mono text-zinc-500 flex items-center justify-between border-t border-zinc-900">
                <span>Verification State: AUDITED</span>
                <span className="text-emerald-400">100% Compliance Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
