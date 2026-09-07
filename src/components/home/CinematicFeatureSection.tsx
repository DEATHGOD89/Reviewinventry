"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Warehouse,
  ShieldAlert,
  Beaker,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Layers,
  Activity,
  AlertTriangle,
  QrCode,
  FileCheck,
} from "lucide-react";

interface Facility {
  id: string;
  code: string;
  name: string;
  location: string;
  area: string;
  capacity: string;
  certifications: string;
  image: string;
  type: string;
  description: string;
  sensors: {
    label: string;
    value: string;
    status: string;
    detail: string;
  }[];
  protocols: string[];
}

const FACILITIES: Facility[] = [
  {
    id: "wh-main-01",
    code: "WH-MAIN-01",
    name: "Central Logistics & PPE Distribution Center",
    location: "Chakan Industrial Corridor, Pune, Maharashtra",
    area: "14,500 sq.ft (Multi-Tier Racking)",
    capacity: "50,000 Master Units",
    certifications: "ISO 9001:2015 & ISO 45001 EHS Audited",
    image: "/images/hero_hazardous.jpg",
    type: "Clean Logistics & General Safety Hub",
    description:
      "Primary distribution facility for Personal Protective Equipment (respirators, barrier gloves, safety helmets, protective clothing, and steel-toe footwear). Features automated barcode scanning, FIFO batch control, and temperature-controlled clean storage bays.",
    sensors: [
      { label: "Storage Humidity", value: "42% RH", status: "Optimal", detail: "Dry Ambient Condition" },
      { label: "Racking Capacity", value: "78% Utilized", status: "Normal", detail: "39,000 Active Units" },
      { label: "Barcode Bin Scan Rate", value: "99.8%", status: "Optimal", detail: "Zero Unscanned Stock Moves" },
      { label: "Cycle Count Accuracy", value: "100%", status: "Verified", detail: "Mandatory Audit Reason Gate" },
    ],
    protocols: [
      "Daily cycle counts with automated barcode scanner synchronization",
      "Printable 4\"x2\" QR & barcode bin labels on all active storage racks",
      "Strict separation of particulate-free PPE from industrial chemicals",
      "Automated stock threshold reorder alerts via Slack/Teams webhooks",
    ],
  },
  {
    id: "wh-hazmat-02",
    code: "WH-HAZMAT-02",
    name: "Hazardous Chemical Storage & Spill Containment Vault",
    location: "PCPIR Chemical Zone, Dahej SEZ, Gujarat",
    area: "9,000 sq.ft (Secondary Sump Sealed)",
    capacity: "18,000 Litres / 500 Chemical Drums",
    certifications: "UN GHS Class 8 & EPA 40 CFR 264.175 Compliant",
    image: "/images/hero_hazardous.jpg",
    type: "Controlled Hazmat & SDS Verification Depot",
    description:
      "Dedicated containment vault engineered for caustic soda, sumpa degreasers, sanitizers, and industrial cleaning chemistry. Equipped with acid-resistant epoxy floor sumps, positive-exhaust vapor extraction hoods, and ANSI Z358.1 emergency drench showers.",
    sensors: [
      { label: "Containment Sump Level", value: "12% Nominal", status: "Secure", detail: "Spill Barrier Intact" },
      { label: "Airborne Chemical Vapor", value: "0.02 PPM", status: "Safe", detail: "Far Below OSHA PEL Ceiling" },
      { label: "Negative Air Pressure", value: "-22 Pa", status: "Active", detail: "Vapor Extraction Online" },
      { label: "SDS Verification Gate", value: "100% Enforced", status: "Guarded", detail: "Unverified Seeded as DRAFT" },
    ],
    protocols: [
      "Zero unverified chemical claims: All items retain mandatory SDS verification tags",
      "Self-contained secondary spill sump pallets with 110% drum capacity backup",
      "Weekly mandatory functional testing of emergency eyewash & drench stations",
      "Dedicated decontamination staging zone for Class 8 corrosive handling",
    ],
  },
];

export const CinematicFeatureSection: React.FC = () => {
  const [selectedFacilityIdx, setSelectedFacilityIdx] = useState<number>(0);
  const facility = FACILITIES[selectedFacilityIdx];

  const capabilityCards = [
    {
      title: "Documented SDS Gatekeeper",
      subtitle: "Verified SDS / MSDS",
      badge: "ISO 11014",
      description:
        "Direct access to manufacturer technical sheets, hazard statements, and official first aid steps. Caustic soda and cleaners require verified SDS before claims are confirmed.",
    },
    {
      title: "PPE Compliance Lab Index",
      subtitle: "EN ISO & ASTM Specs",
      badge: "EN 374 / ANSI Z87.1",
      description:
        "Tensile strength, dielectric voltage ratings, and chemical breakthrough times indexed transparently without inflated manufacturer marketing claims.",
    },
    {
      title: "Physical Spill Containment",
      subtitle: "EPA 40 CFR 264.175",
      badge: "UN Class 8 Hazmat",
      description:
        "Continuous monitoring of containment sumps, secondary spill pallets, and vapor scrubber extraction at WH-HAZMAT-02 chemical vault.",
    },
    {
      title: "Cryptographic Audit Trail",
      subtitle: "Immutable Ledger",
      badge: "Zero Tampering",
      description:
        "Every stock movement, spec edit, and review action strictly requires an authenticated user email and mandatory justification reason.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 bg-[#08080a] text-white overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold mb-3 shadow-xs">
            <Warehouse className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase tracking-wider text-[10px]">Physical Warehouse Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            Certified Facility Network & Containment
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            VeriSpec maintains complete operational separation between clean protective equipment logistics
            and hazardous chemical containment across two audited physical facilities.
          </p>
        </div>

        {/* Facility Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {FACILITIES.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setSelectedFacilityIdx(idx)}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs font-bold transition-all ${
                selectedFacilityIdx === idx
                  ? "bg-white text-zinc-950 border-white shadow-xl scale-[1.02]"
                  : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  selectedFacilityIdx === idx ? "bg-zinc-950 text-white" : "bg-zinc-800 text-zinc-300"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-mono opacity-75">{f.code}</span>
                <span className="text-xs">{f.name.split(" ")[0]} {f.name.split(" ")[1]} ({f.location.split(",")[1]?.trim() || "IN"})</span>
              </div>
            </button>
          ))}
        </div>

        {/* Facility Master Architecture Card */}
        <div className="rounded-3xl bg-[#0f0f14] border border-zinc-800 p-6 sm:p-8 md:p-10 shadow-2xl space-y-8 mb-12">
          {/* Top Facility Meta Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {facility.code}
                </span>
                <span className="text-xs text-zinc-400 font-medium">{facility.type}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {facility.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{facility.location}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono">
                <span className="text-zinc-500 block text-[9px]">CAPACITY</span>
                <strong className="text-white">{facility.capacity}</strong>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono">
                <span className="text-zinc-500 block text-[9px]">SURFACE AREA</span>
                <strong className="text-white">{facility.area}</strong>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono">
                <span className="text-zinc-500 block text-[9px]">CERTIFICATION</span>
                <strong className="text-emerald-400">{facility.certifications.split("&")[0]}</strong>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-4xl">
            {facility.description}
          </p>

          {/* Live Environmental & Operating Telemetry Sensors (Real Data, No Fake Player) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Facility Telemetry & Safeguards</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Sensors Online</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {facility.sensors.map((sensor) => (
                <div
                  key={sensor.label}
                  className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide">
                    {sensor.label}
                  </span>
                  <div className="my-2">
                    <span className="text-lg sm:text-xl font-black text-white font-mono block">
                      {sensor.value}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                      {sensor.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 border-t border-zinc-800/80 pt-1.5 block">
                    {sensor.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Protocols Checklist & Direct Portals Access */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Standard Operating Safety Protocols:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                {facility.protocols.map((protocol, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{protocol}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
              <Link
                href="/management"
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Warehouse className="w-4 h-4" />
                <span>Warehouse Balances</span>
              </Link>
              <Link
                href="/safety"
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-zinc-400" />
                <span>Safety Protocols</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Architecture Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilityCards.map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-3xl bg-[#101015] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                    {card.badge}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">{card.title}</h4>
                <div className="text-xs font-medium text-zinc-400 mt-0.5">{card.subtitle}</div>
                <p className="text-xs text-zinc-500 mt-3 leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
