"use client";

import React, { useState } from "react";
import { X, Printer, QrCode, Tag, Check, Box, ShieldCheck, MapPin } from "lucide-react";
import { ProductItem } from "@/lib/catalog-data";

interface WarehouseLabelModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WarehouseLabelModal: React.FC<WarehouseLabelModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [labelSize, setLabelSize] = useState<"4x2" | "3x1">("4x2");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const productUrl = `http://localhost:3000/products/${product.slug}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySku = () => {
    navigator.clipboard.writeText(product.sku);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container - hide on print except label */}
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-zinc-200 shadow-2xl space-y-6">
        {/* Header (hidden on print) */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-zinc-900 text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950">Warehouse Bin & Rack Label</h3>
              <p className="text-[11px] text-zinc-500 font-mono">Printable 300DPI Thermal / Laser Tag</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Size Selector Toolbar (hidden on print) */}
        <div className="flex items-center justify-between text-xs print:hidden bg-zinc-50 p-2.5 rounded-2xl border border-zinc-200">
          <span className="font-semibold text-zinc-700">Label Format:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLabelSize("4x2")}
              className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
                labelSize === "4x2" ? "bg-zinc-950 text-white" : "bg-white text-zinc-600 border border-zinc-200"
              }`}
            >
              4&quot; &times; 2&quot; Bin Sticker
            </button>
            <button
              onClick={() => setLabelSize("3x1")}
              className={`px-3 py-1 rounded-full font-bold text-xs transition-all ${
                labelSize === "3x1" ? "bg-zinc-950 text-white" : "bg-white text-zinc-600 border border-zinc-200"
              }`}
            >
              3&quot; &times; 1&quot; Shelf Tag
            </button>
          </div>
        </div>

        {/* Printable Physical Label Preview */}
        <div
          id="printable-warehouse-label"
          className={`border-2 border-dashed border-zinc-800 bg-white p-5 rounded-2xl mx-auto text-black font-sans shadow-inner ${
            labelSize === "4x2" ? "max-w-md w-full" : "max-w-sm w-full"
          }`}
        >
          {/* Label Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
            <div className="flex items-center gap-1.5 font-mono font-black text-xs tracking-wider uppercase">
              <span className="bg-black text-white px-1.5 py-0.5 rounded text-[10px]">VERISPEC</span>
              <span>LOGISTICS CONTROL</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-zinc-100 border border-black px-2 py-0.5 rounded">
              LOC: {product.inventory.locationCode}
            </span>
          </div>

          {/* Product Identification & Barcode Area */}
          <div className="grid grid-cols-3 gap-3 items-center">
            {/* Left 2 Cols: Details & Barcode */}
            <div className="col-span-2 space-y-1.5">
              <div className="text-[10px] text-zinc-600 uppercase font-semibold">
                {product.categoryName}
              </div>
              <div className="font-extrabold text-base leading-tight line-clamp-2">
                {product.name}
              </div>

              {/* Giant SKU Header */}
              <div className="pt-1">
                <div className="text-[9px] font-mono text-zinc-500 uppercase">Master SKU ID</div>
                <div className="font-mono font-black text-xl tracking-wider text-black">
                  {product.sku}
                </div>
              </div>

              {/* Simulated Code-128 Barcode Vector */}
              <div className="pt-2">
                <svg className="w-full h-8" viewBox="0 0 160 30" xmlns="http://www.w3.org/2000/svg">
                  {/* High contrast barcode stripes */}
                  <rect x="2" y="0" width="3" height="28" fill="#000" />
                  <rect x="7" y="0" width="2" height="28" fill="#000" />
                  <rect x="12" y="0" width="5" height="28" fill="#000" />
                  <rect x="19" y="0" width="2" height="28" fill="#000" />
                  <rect x="23" y="0" width="4" height="28" fill="#000" />
                  <rect x="29" y="0" width="3" height="28" fill="#000" />
                  <rect x="35" y="0" width="2" height="28" fill="#000" />
                  <rect x="39" y="0" width="5" height="28" fill="#000" />
                  <rect x="47" y="0" width="3" height="28" fill="#000" />
                  <rect x="52" y="0" width="2" height="28" fill="#000" />
                  <rect x="57" y="0" width="4" height="28" fill="#000" />
                  <rect x="63" y="0" width="6" height="28" fill="#000" />
                  <rect x="71" y="0" width="2" height="28" fill="#000" />
                  <rect x="75" y="0" width="4" height="28" fill="#000" />
                  <rect x="81" y="0" width="3" height="28" fill="#000" />
                  <rect x="86" y="0" width="2" height="28" fill="#000" />
                  <rect x="91" y="0" width="5" height="28" fill="#000" />
                  <rect x="98" y="0" width="3" height="28" fill="#000" />
                  <rect x="103" y="0" width="4" height="28" fill="#000" />
                  <rect x="109" y="0" width="2" height="28" fill="#000" />
                  <rect x="114" y="0" width="5" height="28" fill="#000" />
                  <rect x="121" y="0" width="3" height="28" fill="#000" />
                  <rect x="126" y="0" width="2" height="28" fill="#000" />
                  <rect x="131" y="0" width="4" height="28" fill="#000" />
                  <rect x="137" y="0" width="5" height="28" fill="#000" />
                  <rect x="144" y="0" width="2" height="28" fill="#000" />
                  <rect x="148" y="0" width="4" height="28" fill="#000" />
                  <rect x="154" y="0" width="3" height="28" fill="#000" />
                </svg>
                <div className="text-center font-mono text-[9px] tracking-widest text-zinc-600">
                  *{product.sku}*
                </div>
              </div>
            </div>

            {/* Right Col: High-Res SVG QR Code */}
            <div className="flex flex-col items-center justify-center p-2 bg-zinc-50 border-2 border-black rounded-xl">
              <svg className="w-24 h-24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* QR Code Matrix Elements */}
                <rect width="100" height="100" fill="#fff" />
                {/* Corner Markers */}
                <rect x="5" y="5" width="26" height="26" fill="#000" />
                <rect x="9" y="9" width="18" height="18" fill="#fff" />
                <rect x="13" y="13" width="10" height="10" fill="#000" />

                <rect x="69" y="5" width="26" height="26" fill="#000" />
                <rect x="73" y="9" width="18" height="18" fill="#fff" />
                <rect x="77" y="13" width="10" height="10" fill="#000" />

                <rect x="5" y="69" width="26" height="26" fill="#000" />
                <rect x="9" y="73" width="18" height="18" fill="#fff" />
                <rect x="13" y="77" width="10" height="10" fill="#000" />

                {/* Simulated Data Points */}
                <rect x="36" y="8" width="5" height="5" fill="#000" />
                <rect x="46" y="8" width="5" height="5" fill="#000" />
                <rect x="56" y="8" width="5" height="5" fill="#000" />
                <rect x="36" y="18" width="5" height="5" fill="#000" />
                <rect x="46" y="23" width="5" height="5" fill="#000" />
                <rect x="56" y="18" width="5" height="5" fill="#000" />
                <rect x="8" y="36" width="5" height="5" fill="#000" />
                <rect x="18" y="46" width="5" height="5" fill="#000" />
                <rect x="8" y="56" width="5" height="5" fill="#000" />
                <rect x="36" y="36" width="5" height="5" fill="#000" />
                <rect x="46" y="36" width="5" height="5" fill="#000" />
                <rect x="56" y="46" width="5" height="5" fill="#000" />
                <rect x="66" y="36" width="5" height="5" fill="#000" />
                <rect x="76" y="46" width="5" height="5" fill="#000" />
                <rect x="86" y="36" width="5" height="5" fill="#000" />
                <rect x="36" y="66" width="5" height="5" fill="#000" />
                <rect x="46" y="76" width="5" height="5" fill="#000" />
                <rect x="56" y="66" width="5" height="5" fill="#000" />
                <rect x="66" y="76" width="5" height="5" fill="#000" />
                <rect x="76" y="66" width="5" height="5" fill="#000" />
                <rect x="86" y="76" width="5" height="5" fill="#000" />
                <rect x="46" y="56" width="5" height="5" fill="#000" />
                <rect x="56" y="86" width="5" height="5" fill="#000" />
                <rect x="66" y="86" width="5" height="5" fill="#000" />
                <rect x="76" y="86" width="5" height="5" fill="#000" />
              </svg>
              <span className="text-[8px] font-mono font-bold mt-1 text-center text-zinc-600 uppercase">
                Scan for SDS
              </span>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="mt-3 pt-2 border-t border-zinc-300 flex items-center justify-between text-[9px] font-mono text-zinc-600">
            <span>UOM: {product.unitOfMeasure}</span>
            <span>MIN THRESHOLD: {product.inventory.minStock}</span>
            <span>REORDER QTY: {product.inventory.reorderQty}</span>
          </div>
        </div>

        {/* Action Buttons (hidden on print) */}
        <div className="flex items-center gap-3 pt-2 print:hidden">
          <button
            onClick={handleCopySku}
            className="flex-1 py-2.5 px-4 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Tag className="w-3.5 h-3.5" />}
            <span>{copied ? "SKU Copied!" : "Copy SKU"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Label (300 DPI)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
