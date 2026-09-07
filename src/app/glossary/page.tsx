import React from "react";
import { BookOpen, Shield, Beaker, Layers } from "lucide-react";

export default function GlossaryPage() {
  const terms = [
    {
      term: "EN ISO 374-1 (Chemical Glove Standard)",
      category: "PPE & Gloves",
      definition:
        "European and international standard specifying performance requirements for gloves designed to protect users against chemicals and micro-organisms. Categorizes gloves into Type A, Type B, or Type C based on breakthrough permeation testing against a list of 18 test chemicals.",
    },
    {
      term: "AQL (Acceptable Quality Limit)",
      category: "Quality Inspection",
      definition:
        "Statistical standard used to define the maximum acceptable defect rate in a manufacturing batch. For medical and industrial examination gloves, AQL 1.5 denotes high barrier integrity against pinhole water leaks.",
    },
    {
      term: "SDS / MSDS (Safety Data Sheet)",
      category: "Chemical Safety",
      definition:
        "A formal document containing comprehensive physical, chemical, toxicity, first-aid, ecological, handling, and storage information for hazardous substances. VeriSpec strictly requires verified manufacturer SDS documentation before publishing chemical claims.",
    },
    {
      term: "Corrosive Substance (Class 8 Hazard)",
      category: "Chemical Hazard",
      definition:
        "Chemicals that cause severe irreversible destruction to living tissue (such as chemical burns) or severe corrosion to transport metals upon contact. Caustic Soda is a Class 8 corrosive substance.",
    },
    {
      term: "Dielectric Insulation Class",
      category: "Electrical PPE",
      definition:
        "Classification rating for rubber insulating gloves (Classes 00 through 4) defining the maximum proof-test voltage and working voltage for energized electrical work.",
    },
    {
      term: "EN ISO 20345 (Safety Footwear)",
      category: "Foot Protection",
      definition:
        "Standard for protective industrial footwear specifying a minimum toe cap impact resistance of 200 Joules and compression resistance of 15,000 Newtons.",
    },
  ];

  return (
    <div className="pt-28 pb-24 px-6 max-w-5xl mx-auto">
      <div className="mb-10 pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-zinc-900" />
          <span>Technical Reference</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
          Safety Standards & Chemical Glossary
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1 max-w-xl leading-relaxed">
          Clear definitions of technical standards, chemical hazard classes, and inspection metrics referenced in our product master.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {terms.map((t) => (
          <div
            key={t.term}
            className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3"
          >
            <div className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {t.category}
            </div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">{t.term}</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">{t.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
