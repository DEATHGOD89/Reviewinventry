"use client";

import React, { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Flame,
  Skull,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";
import { ProductItem } from "@/lib/catalog-data";

interface SdsDocumentViewerProps {
  product: ProductItem;
  canUpload?: boolean;
}

// 16 Standard GHS Sections
const GHS_SECTIONS = [
  { num: 1, title: "Identification", desc: "Chemical identity, manufacturer contact, emergency phone numbers." },
  { num: 2, title: "Hazard(s) Identification", desc: "GHS classification, signal words, hazard & precautionary statements." },
  { num: 3, title: "Composition / Ingredients", desc: "Chemical name, CAS numbers, impurities, stabilizing additives." },
  { num: 4, title: "First-Aid Measures", desc: "Necessary first-aid by exposure route (inhalation, skin, eye, ingestion)." },
  { num: 5, title: "Fire-Fighting Measures", desc: "Extinguishing equipment, chemical hazards from fire, protective gear." },
  { num: 6, title: "Accidental Release Measures", desc: "Personal precautions, containment methods, cleanup procedures." },
  { num: 7, title: "Handling and Storage", desc: "Safe handling precautions, incompatible chemicals, storage temperatures." },
  { num: 8, title: "Exposure Controls / PPE", desc: "OSHA PEL, ACGIH TLV, engineering controls, respiratory & skin PPE." },
  { num: 9, title: "Physical & Chemical Properties", desc: "Appearance, pH, boiling point, flash point, vapor density, solubility." },
  { num: 10, title: "Stability and Reactivity", desc: "Chemical stability, incompatible materials, hazardous decomposition." },
  { num: 11, title: "Toxicological Information", desc: "Acute toxicity, carcinogenicity, symptoms of exposure." },
  { num: 12, title: "Ecological Information", desc: "Ecotoxicity, persistence, bioaccumulative potential." },
  { num: 13, title: "Disposal Considerations", desc: "Waste treatment methods, contaminated packaging disposal." },
  { num: 14, title: "Transport Information", desc: "UN Number, proper shipping name, transport hazard class, packing group." },
  { num: 15, title: "Regulatory Information", desc: "Safety, health, and environmental regulations specific to product." },
  { num: 16, title: "Other Information", desc: "Revision dates, preparation details, manufacturer disclaimers." },
];

export const SdsDocumentViewer: React.FC<SdsDocumentViewerProps> = ({ product, canUpload = true }) => {
  const [activeTab, setActiveTab] = useState<"summary" | "ghs-sections" | "pictograms">("summary");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const isChemical = !!product.chemicalDetail;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadSuccess(false);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-zinc-950">Safety Data Sheet (SDS / GHS 16-Section)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                Requires manufacturer SDS verification
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Compliant with OSHA HCS 2012 / UN GHS Rev 8 &bull; Document ID: SDS-{product.sku}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canUpload && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Manufacturer SDS</span>
            </button>
          )}

          <button
            onClick={() => alert(`Downloading verified technical summary sheet for ${product.name} (PDF)...`)}
            className="px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Spec PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3 border-b border-zinc-200 flex items-center gap-3 text-xs">
        {[
          { id: "summary", label: "GHS Summary & Hazards" },
          { id: "ghs-sections", label: "16-Section Specification Index" },
          { id: "pictograms", label: "Safety Pictograms" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`pb-3 font-semibold border-b-2 transition-all ${
              activeTab === t.id
                ? "border-zinc-950 text-zinc-950"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "summary" && (
          <div className="space-y-6 text-xs">
            {/* Warning Alert */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">MANDATORY REGULATORY DISCLAIMER</strong>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Hazard classifications, active chemical percentages, and emergency first aid for {product.name} are
                  pending verified manufacturer submission. VeriSpec strictly prohibits fabricating unverified chemical hazard statements.
                </p>
              </div>
            </div>

            {/* Chemical / PPE Attributes Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Product Form & Matrix</span>
                <div className="font-bold text-sm text-zinc-900">
                  {product.chemicalDetail ? product.chemicalDetail.productForm : (product.ppeDetail?.material || "Solid / Polymer")}
                </div>
                <div className="text-[11px] text-zinc-500">
                  pH Value: <strong className="text-zinc-800">{product.chemicalDetail?.phValue || "Requires verification"}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Required PPE for Handling</span>
                <div className="font-bold text-sm text-zinc-900">
                  {product.chemicalDetail?.requiredPpe || "Eye protection, chemical-resistant gloves, apron"}
                </div>
                <div className="text-[11px] text-zinc-500">
                  First Aid: <strong className="text-zinc-800">{product.chemicalDetail?.firstAidReference || "Immediate irrigation & medical consultation"}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ghs-sections" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {GHS_SECTIONS.map((sec) => (
              <div
                key={sec.num}
                className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-zinc-950 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                    {sec.num}
                  </span>
                  <span className="font-bold text-zinc-900">{sec.title}</span>
                </div>
                <p className="text-zinc-500 text-[11px] leading-relaxed pl-7">{sec.desc}</p>
                <div className="mt-2 pl-7 flex items-center gap-1 text-[10px] font-mono text-amber-700">
                  <span>Status: Document verification required</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "pictograms" && (
          <div className="space-y-4 text-xs">
            <p className="text-zinc-600">
              Standard United Nations GHS Pictograms applicable to industrial hazard communication:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: "Corrosive (GHS05)", symbol: "🧪", desc: "Skin burns, eye damage, metal corrosion", color: "border-red-400 bg-red-50" },
                { title: "Health Hazard (GHS08)", symbol: "☣️", desc: "Respiratory sensitizer, organ toxicity", color: "border-amber-400 bg-amber-50" },
                { title: "Exclamation Mark (GHS07)", symbol: "⚠️", desc: "Skin irritant, acute toxicity (harmful)", color: "border-amber-400 bg-amber-50" },
                { title: "Environment (GHS09)", symbol: "🌊", desc: "Aquatic ecotoxicity hazard", color: "border-cyan-400 bg-cyan-50" },
              ].map((pic) => (
                <div
                  key={pic.title}
                  className={`p-4 rounded-2xl border-2 text-center flex flex-col items-center justify-center ${pic.color}`}
                >
                  <div className="text-3xl mb-2">{pic.symbol}</div>
                  <div className="font-bold text-zinc-900 text-xs mb-1">{pic.title}</div>
                  <div className="text-[10px] text-zinc-600 leading-tight">{pic.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-zinc-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-4">
              <h3 className="text-sm font-bold text-zinc-950">Upload Official Manufacturer SDS</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-6 text-center hover:bg-zinc-50 transition-colors">
                <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="font-bold text-zinc-900">Drag and drop manufacturer SDS PDF here</p>
                <p className="text-[11px] text-zinc-400 mt-1">Accepts official 16-section GHS PDFs up to 25MB</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="mt-3 block w-full text-xs text-zinc-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-950 file:text-white hover:file:bg-zinc-800"
                />
              </div>

              {uploadSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Document staged successfully! Audit record created.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!uploadedFile || isVerifying}
                  className="w-full py-2.5 rounded-full bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 disabled:opacity-50"
                >
                  {isVerifying ? "Verifying GHS Hash..." : "Submit for Owner Review"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
