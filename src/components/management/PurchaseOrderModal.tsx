"use client";

import React, { useState } from "react";
import { StockAlert } from "@/lib/services/stock-alerts";
import { ProductItem } from "@/lib/catalog-data";
import {
  FileText,
  Printer,
  Copy,
  CheckCircle2,
  X,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: StockAlert[];
  allProducts: ProductItem[];
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  alerts,
  allProducts,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const poNumber = `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  const poDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Compile line items
  const lineItems = alerts.map((alert) => {
    const product = allProducts.find((p) => p.id === alert.productId);
    const unitPrice = product?.indicativePriceInr || 1500;
    const qty = alert.suggestedReorderQty || 50;
    const lineTotal = unitPrice * qty;
    const externalLink = product?.externalPurchaseLinks?.[0];

    return {
      sku: alert.sku,
      name: alert.productName,
      locationCode: alert.locationCode,
      currentStock: alert.currentStock,
      minStock: alert.minStock,
      qty,
      unitPrice,
      lineTotal,
      supplierName: externalLink?.sellerName || "Authorized Industrial Supplier",
      supplierUrl: externalLink?.url || "#",
    };
  });

  const totalCostInr = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const handleCopyText = () => {
    const summaryText = `VERISPEC PURCHASE REQUISITION ORDER: ${poNumber}
Date: ${poDate}
Warehouse: WH-MAIN-01
Total Items: ${lineItems.length}
Total Estimated Cost: ₹${totalCostInr.toLocaleString("en-IN")} INR

ITEMS:
${lineItems
  .map(
    (item, idx) =>
      `${idx + 1}. [${item.sku}] ${item.name} - Qty: ${item.qty} units @ ₹${item.unitPrice}/unit = ₹${item.lineTotal.toLocaleString("en-IN")}`
  )
  .join("\n")}

Authorized by: Operations Lead (manager@verispec.local)`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-zinc-200 shadow-2xl overflow-hidden my-8 print:m-0 print:border-none print:shadow-none">
        {/* Modal Toolbar */}
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Autonomous Purchase Order Generator
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
              {poNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PO</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 sm:p-12 text-zinc-900 bg-white font-sans space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-zinc-950 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BrandLogo variant="dark" className="w-7 h-7 rounded-lg" />
                <span className="font-black text-xl tracking-tight">VERISPEC INTEL</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 uppercase font-mono">
                  Autonomous Procurement
                </span>
              </div>
              <div className="text-xs text-zinc-500 mt-1 font-mono">
                Logistics & Industrial Replenishment Division
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs space-y-0.5">
              <div className="font-bold text-zinc-900 text-sm">ORDER: {poNumber}</div>
              <div className="text-zinc-500">Date: {poDate}</div>
              <div className="text-emerald-700 font-bold">Status: REQUISITION ISSUED</div>
            </div>
          </div>

          {/* Logistics Routing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Ship-To Facility</span>
              <strong className="text-zinc-900">WH-MAIN-01 • Chakan Central Logistics Depot</strong>
              <div className="text-zinc-500 text-[11px]">Industrial Corridor, Maharashtra, India</div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Requisitioning Officer</span>
              <strong className="text-zinc-900">Operations Desk (manager@verispec.local)</strong>
              <div className="text-zinc-500 text-[11px]">Audit Certified Automated Replenishment</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-100 font-mono text-[11px] text-zinc-700 border-b border-zinc-200">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product Description</th>
                  <th className="p-3 text-center">Stock / Min</th>
                  <th className="p-3 text-center">Reorder Qty</th>
                  <th className="p-3 text-right">Unit Ref (INR)</th>
                  <th className="p-3 text-right">Subtotal (INR)</th>
                  <th className="p-3 text-center print:hidden">Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-mono text-[11px]">
                {lineItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-zinc-500">
                      All inventory balances are currently above minimum threshold.
                    </td>
                  </tr>
                ) : (
                  lineItems.map((item) => (
                    <tr key={item.sku} className="hover:bg-zinc-50">
                      <td className="p-3 font-bold text-zinc-900">{item.sku}</td>
                      <td className="p-3 text-zinc-800 font-sans font-medium">{item.name}</td>
                      <td className="p-3 text-center text-zinc-500">
                        <span className="text-red-600 font-bold">{item.currentStock}</span> / {item.minStock}
                      </td>
                      <td className="p-3 text-center font-bold text-zinc-950 bg-amber-50/50">
                        {item.qty} units
                      </td>
                      <td className="p-3 text-right text-zinc-600">₹{item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold text-zinc-900">
                        ₹{item.lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-center print:hidden">
                        {item.supplierUrl !== "#" ? (
                          <a
                            href={item.supplierUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-cyan-700 hover:text-cyan-900 font-semibold underline"
                          >
                            <span>{item.supplierName}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-zinc-400">Vendor Desk</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-zinc-50 border-t-2 border-zinc-900 font-mono text-xs">
                <tr>
                  <td colSpan={5} className="p-3 text-right font-bold text-zinc-900">
                    Grand Total Estimated Requisition:
                  </td>
                  <td className="p-3 text-right font-black text-sm text-zinc-950">
                    ₹{totalCostInr.toLocaleString("en-IN", { minimumFractionDigits: 2 })} INR
                  </td>
                  <td className="print:hidden"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notice & Signatures */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-[11px] text-zinc-500 border-t border-zinc-200">
            <div className="space-y-1">
              <strong className="text-zinc-700 block">Procurement Disclaimer:</strong>
              <p className="leading-relaxed">
                VeriSpec generates this order requisition autonomously based on recorded warehouse depletion thresholds.
                Prices reflect indicative market benchmarks and are subject to supplier contractual agreements.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-b border-zinc-300 pb-6">
                <span className="text-zinc-400 block text-[10px]">AUTHORIZED SIGNATURE:</span>
                <div className="font-mono text-zinc-900 font-bold text-xs mt-1">
                  manager@verispec.local &bull; Operations Lead
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
