"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Shield,
  Beaker,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

interface GlossaryTerm {
  term: string;
  category: "Chemical Safety" | "PPE & Equipment" | "Quality & Testing" | "Facility & Storage" | "Regulatory";
  standardCode?: string;
  definition: string;
  significance: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "EN ISO 374-1 (Chemical Glove Permeation)",
    category: "PPE & Equipment",
    standardCode: "ISO 374-1:2016",
    definition:
      "European and international standard specifying performance requirements for gloves protecting users against chemicals and micro-organisms. Categorizes gloves into Type A (≥6 chemicals tested for >30min), Type B (≥3 chemicals), or Type C (≥1 chemical).",
    significance: "Crucial for handling corrosive alkalis (like Caustic Soda) and concentrated solvents.",
  },
  {
    term: "AQL (Acceptable Quality Limit)",
    category: "Quality & Testing",
    standardCode: "ISO 2859-1",
    definition:
      "Statistical standard used to define the maximum acceptable defect rate in a manufacturing batch. For medical and industrial examination gloves, AQL 1.5 denotes high barrier integrity against pinhole water leaks.",
    significance: "Determines whether an entire batch passes incoming warehouse inspection.",
  },
  {
    term: "SDS / MSDS (Safety Data Sheet)",
    category: "Chemical Safety",
    standardCode: "GHS / OSHA 1910.1200",
    definition:
      "A formal 16-section document containing comprehensive physical, chemical, toxicity, first-aid, ecological, handling, and storage information for hazardous substances. VeriSpec strictly requires verified manufacturer SDS documentation before publishing chemical claims.",
    significance: "VeriSpec zero-hallucination baseline. No unverified chemical properties are published without official SDS.",
  },
  {
    term: "Corrosive Substance (GHS Class 8 Hazard)",
    category: "Chemical Safety",
    standardCode: "UN Class 8 / GHS05",
    definition:
      "Chemicals that cause severe irreversible destruction to living tissue (chemical burns) or severe corrosion to transport metals upon contact. Caustic Soda (Sodium Hydroxide) is a primary Class 8 corrosive substance.",
    significance: "Requires dedicated secondary containment, acid/alkali-resistant piping, and full-face eye shield.",
  },
  {
    term: "NIOSH TC-84A (Air-Purifying Respirator Standards)",
    category: "PPE & Equipment",
    standardCode: "42 CFR Part 84",
    definition:
      "United States National Institute for Occupational Safety and Health certification for particulate, gas, and vapor respirators. Designations include N (Not oil resistant), R (Oil resistant), and P (Oil proof) with 95, 99, or 99.97% (100) efficiency.",
    significance: "Ensures personnel in high vapor zones receive certified respiratory filtration.",
  },
  {
    term: "EN 388:2016 (Mechanical Risk Rating)",
    category: "PPE & Equipment",
    standardCode: "EN 388",
    definition:
      "Standard evaluating gloves against mechanical hazards using a 4 or 6-digit score covering abrasion resistance (1-4), cut resistance (Coupe test 1-5 or ISO TDM A-F), tear resistance (1-4), and puncture resistance (1-4).",
    significance: "Assesses durability on heavy machinery, sheet metal processing, and scrap handling.",
  },
  {
    term: "Dielectric Insulation Class",
    category: "PPE & Equipment",
    standardCode: "IEC 60903 / ASTM D120",
    definition:
      "Classification rating for rubber insulating gloves (Classes 00 through 4) defining the maximum proof-test voltage and working voltage for energized electrical work.",
    significance: "Guarantees electrical arc flash barrier protection up to specified kilovolt limits.",
  },
  {
    term: "EN ISO 20345 (Safety Footwear)",
    category: "PPE & Equipment",
    standardCode: "EN ISO 20345:2022",
    definition:
      "Standard for protective industrial footwear specifying a minimum toe cap impact resistance of 200 Joules and compression resistance of 15,000 Newtons, along with anti-penetration midsole standards.",
    significance: "Prevents crushing injuries and foot punctures from warehouse machinery and dropped tools.",
  },
  {
    term: "EN 166 (Personal Eye Protection)",
    category: "PPE & Equipment",
    standardCode: "EN 166:2001",
    definition:
      "European standard identifying performance ratings for safety spectacles, goggles, and face shields against high-speed particles, optical radiation, droplets, and molten metal splashes.",
    significance: "Mandatory standard for chemical splashing and mechanical grinding visors.",
  },
  {
    term: "Secondary Containment 110% Rule",
    category: "Facility & Storage",
    standardCode: "EPA 40 CFR 264.175",
    definition:
      "Regulatory standard mandating that chemical storage bunds or spill pallets must hold at least 110% of the volume of the single largest container stored, or 25% of the total aggregate volume, whichever is greater.",
    significance: "Enforced in VeriSpec's Dahej Hazmat Vault (WH-HAZMAT-02) for bulk drum containment.",
  },
  {
    term: "NFPA 704 (Standard Hazard Identification Diamond)",
    category: "Regulatory",
    standardCode: "NFPA 704",
    definition:
      "System maintained by the National Fire Protection Association identifying hazard severities using a 4-color diamond: Blue (Health), Red (Flammability), Yellow (Instability), and White (Special hazards) from 0 to 4.",
    significance: "Enables rapid emergency first-responder assessment during warehouse incidents.",
  },
  {
    term: "Breakthrough Permeation Time",
    category: "Quality & Testing",
    standardCode: "ASTM F739",
    definition:
      "The elapsed time between initial chemical contact on the outside of a glove or suit material and its analytical detection on the inside surface at a standardized rate of 0.1 µg/cm²/min.",
    significance: "Determines safe single-shift exposure limits for industrial glove wearers.",
  },
  {
    term: "REACH & SVHC (Substances of Very High Concern)",
    category: "Regulatory",
    standardCode: "EC 1907/2006",
    definition:
      "European Union chemical regulation covering the Registration, Evaluation, Authorisation, and Restriction of Chemicals. Identifies carcinogenic, mutagenic, or toxic substances requiring special authorization.",
    significance: "Governs international export legality and safety compliance across Europe.",
  },
  {
    term: "OSHA 1910.120 (HAZWOPER Protocols)",
    category: "Regulatory",
    standardCode: "29 CFR 1910.120",
    definition:
      "Standard covering Hazardous Waste Operations and Emergency Response. Outlines requirements for decontamination zones, emergency response plans, and personnel protective equipment levels (A through D).",
    significance: "Defines protocols when responding to major chemical drum leaks in storage hubs.",
  },
];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Chemical Safety", "PPE & Equipment", "Quality & Testing", "Facility & Storage", "Regulatory"];

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((t) => {
      const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.standardCode && t.standardCode.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="pt-28 pb-24 px-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-zinc-900" />
          <span>Technical Knowledge Hub</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
          Safety Standards & Chemical Glossary
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
          Authoritative definitions of international compliance standards, testing metrics, chemical hazard classifications, and containment protocols referenced across our product catalogue.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search standards (e.g. EN ISO 374, NIOSH, Class 8, AQL, OSHA)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-4 px-1">
        <span>Showing {filteredTerms.length} verified definitions</span>
        <span>Strict Zero-Hallucination Reference</span>
      </div>

      {/* Glossary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTerms.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-3xl bg-zinc-50 border border-zinc-200 text-zinc-500 text-xs">
            No terms found matching &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;EN&rdquo;, &ldquo;SDS&rdquo;, or &ldquo;OSHA&rdquo;.
          </div>
        ) : (
          filteredTerms.map((t) => (
            <div
              key={t.term}
              className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-zinc-300 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold">
                    {t.category}
                  </span>
                  {t.standardCode && (
                    <span className="text-[10px] font-mono text-zinc-400 font-medium">
                      Ref: {t.standardCode}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                  {t.term}
                </h3>

                <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                  {t.definition}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100">
                <div className="text-[11px] text-zinc-500">
                  <strong className="text-zinc-700">VeriSpec Significance: </strong>
                  <span>{t.significance}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
