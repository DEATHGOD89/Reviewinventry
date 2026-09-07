"use client";

import React, { useRef } from "react";
import { ProductItem } from "@/lib/catalog-data";
import {
  Printer,
  X,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  MapPin,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface SpecSheetModalProps {
  product: ProductItem;
  isOpen: boolean;
  onClose: () => void;
}

export const SpecSheetModal: React.FC<SpecSheetModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const documentNumber = `TDS-${new Date().getFullYear()}-${product.sku}`;
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      {/* Container */}
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-zinc-200 shadow-2xl overflow-hidden my-8 print:m-0 print:border-none print:shadow-none print:rounded-none">
        {/* Modal Toolbar (hidden during print) */}
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Technical Datasheet (TDS) Preview
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
              {documentNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-8 sm:p-12 text-zinc-900 bg-white font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-zinc-900 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BrandLogo variant="dark" className="w-6 h-6 rounded-md" />
                <span className="font-extrabold tracking-tight text-lg text-zinc-950">
                  VERISPEC INTEL
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                  Technical Registry
                </span>
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                ISO 9001 / OSHA 1910 Industrial Specification Division
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono space-y-0.5">
              <div className="font-bold text-zinc-900">DOC: {documentNumber}</div>
              <div className="text-zinc-500">Date Issued: {currentDate}</div>
              <div className="text-emerald-700 font-semibold">
                Status: {product.status} (VeriSpec Audit Level: {product.dataConfidenceLevel})
              </div>
            </div>
          </div>

          {/* Product Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-zinc-200">
            {/* Product Image */}
            <div className="space-y-2">
              <div className="w-full h-56 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <span className="text-xs text-zinc-400 font-mono">No Image Seeded</span>
                )}
              </div>
              <div className="text-[10px] text-zinc-400 text-center font-mono">
                SKU: {product.sku} &bull; Primary Specimen
              </div>
            </div>

            {/* Product Main Specs */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">
                  {product.name}
                </h1>
                <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                  {product.shortDescription}
                </p>
              </div>

              {/* Warehouse & Reference Logistics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Warehouse</span>
                  <strong className="text-zinc-800 text-[11px]">
                    {product.inventory.locationCode} • {product.inventory.locationName}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Recorded Stock</span>
                  <strong className="text-zinc-800 text-[11px]">
                    {product.inventory.currentStock} {product.unitOfMeasure}s
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Indicative Price</span>
                  <strong className="text-zinc-800 text-[11px]">
                    ₹{product.indicativePriceInr.toFixed(2)} INR
                  </strong>
                </div>
              </div>

              {/* Strict Zero Hallucination Audit Box */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong>Verification Audit Notice:</strong> This record is documented under VeriSpec&apos;s
                  non-fabrication policy. All chemical attributes, handling risks, and standards are
                  subject to official manufacturer Safety Data Sheet (SDS) verification prior to critical
                  plant operations.
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Technical Parameters Table */}
          <div className="py-6 border-b border-zinc-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              1. Technical Parameters & Verified Properties
            </h3>

            <div className="rounded-xl border border-zinc-200 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-zinc-100 text-zinc-700 font-mono text-[11px] border-b border-zinc-200">
                  <tr>
                    <th className="p-2.5 font-bold">Property / Specifier</th>
                    <th className="p-2.5 font-bold">Documented Value</th>
                    <th className="p-2.5 font-bold">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 font-semibold text-zinc-800">SKU Reference</td>
                    <td className="p-2.5 text-zinc-600">{product.sku}</td>
                    <td className="p-2.5 text-emerald-700">Verified Internal</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-zinc-800">Category Domain</td>
                    <td className="p-2.5 text-zinc-600">{product.categoryName}</td>
                    <td className="p-2.5 text-emerald-700">Classified</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-zinc-800">Packaging / UOM</td>
                    <td className="p-2.5 text-zinc-600">{product.unitOfMeasure}</td>
                    <td className="p-2.5 text-emerald-700">Confirmed</td>
                  </tr>
                  {product.ppeDetail?.material && (
                    <tr>
                      <td className="p-2.5 font-semibold text-zinc-800">Primary Material</td>
                      <td className="p-2.5 text-zinc-600">{product.ppeDetail.material}</td>
                      <td className="p-2.5 text-emerald-700">Verified</td>
                    </tr>
                  )}
                  {product.ppeDetail?.applicableStandards && (
                    <tr>
                      <td className="p-2.5 font-semibold text-zinc-800">Compliance Standard</td>
                      <td className="p-2.5 text-zinc-600">{product.ppeDetail.applicableStandards}</td>
                      <td className="p-2.5 text-amber-700">Pending Lab Cert</td>
                    </tr>
                  )}
                  {product.chemicalDetail?.hazardClassification && (
                    <tr>
                      <td className="p-2.5 font-semibold text-zinc-800">GHS Classification</td>
                      <td className="p-2.5 text-zinc-600">{product.chemicalDetail.hazardClassification}</td>
                      <td className="p-2.5 text-amber-700">Pending SDS Confirm</td>
                    </tr>
                  )}
                  {product.chemicalDetail?.phValue && (
                    <tr>
                      <td className="p-2.5 font-semibold text-zinc-800">Target pH Range</td>
                      <td className="p-2.5 text-zinc-600">{product.chemicalDetail.phValue}</td>
                      <td className="p-2.5 text-zinc-500">Documented</td>
                    </tr>
                  )}
                  {product.customAttributes && product.customAttributes.length > 0 &&
                    product.customAttributes.map((attr, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-semibold text-zinc-800">{attr.key}</td>
                        <td className="p-2.5 text-zinc-600">{attr.value}</td>
                        <td className="p-2.5 text-zinc-500">Documented</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Handling & Storage Protocols */}
          <div className="py-6 border-b border-zinc-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              2. Storage & Environmental Containment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block">Warehouse Storage Condition</span>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Store in cool, well-ventilated containment bay away from incompatible materials.
                  Maintain relative humidity under 65% for PPE elastomer longevity.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block">Personal Protection & PPE Protocol</span>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Refer to facility HAZMAT standard operating procedures before handling chemical
                  consignments. Always verify container seal integrity upon receipt.
                </p>
              </div>
            </div>
          </div>

          {/* Legal / Non-Store Notice & Sign-Off Seal */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-zinc-400">
            <div className="space-y-1 max-w-lg">
              <p>
                <strong>VERISPEC INTEL SPECIFICATION NOTICE:</strong> This datasheet is issued for technical
                identification, inventory management, and safety documentation purposes. VeriSpec is NOT an
                e-commerce merchant or direct seller.
              </p>
              <p>Certified Repository ID: VS-REG-{product.id} &bull; Cryptographic Record</p>
            </div>

            <div className="text-center p-3 rounded-2xl border-2 border-dashed border-zinc-300 w-44">
              <div className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider">
                VeriSpec Authority
              </div>
              <div className="text-emerald-600 font-black text-xs my-0.5">SEAL VERIFIED</div>
              <div className="text-[9px] text-zinc-400 font-mono">Operations Lead</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
