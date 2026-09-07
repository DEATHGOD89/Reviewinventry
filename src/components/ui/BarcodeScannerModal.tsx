"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductItem } from "@/lib/catalog-data";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { recordInventoryAdjustment } from "@/lib/services/inventory";
import {
  Scan,
  Camera,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  QrCode,
  Package,
  Plus,
  Minus,
} from "lucide-react";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductForAdjustment?: (productId: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectProductForAdjustment,
}) => {
  const [scannedInput, setScannedInput] = useState("");
  const [detectedProduct, setDetectedProduct] = useState<ProductItem | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scanStatus, setScanStatus] = useState<"IDLE" | "SUCCESS" | "NOT_FOUND">("IDLE");
  const [quickAdjustFeedback, setQuickAdjustFeedback] = useState("");

  const allProducts = getAllDynamicProducts();

  useEffect(() => {
    if (isOpen) {
      setScannedInput("");
      setDetectedProduct(null);
      setScanStatus("IDLE");
      setIsScanning(true);
      setQuickAdjustFeedback("");
    }
  }, [isOpen]);

  const handleScanValue = (value: string) => {
    const trimmed = value.trim().toUpperCase();
    setScannedInput(trimmed);

    // Search by SKU, ID, or slug
    const match = allProducts.find(
      (p) =>
        p.sku.toUpperCase() === trimmed ||
        p.id.toUpperCase() === trimmed ||
        p.slug.toUpperCase() === trimmed.toLowerCase()
    );

    if (match) {
      setDetectedProduct(match);
      setScanStatus("SUCCESS");
    } else {
      setDetectedProduct(null);
      setScanStatus("NOT_FOUND");
    }
  };

  const handleQuickStockAdjust = async (type: "STOCK_IN" | "STOCK_OUT", qty: number) => {
    if (!detectedProduct) return;
    try {
      const res = await recordInventoryAdjustment({
        productId: detectedProduct.id,
        movementType: type,
        quantity: qty,
        mandatoryReason: `Physical aisle barcode scan reconciliation (${type === "STOCK_IN" ? "+" : "-"}${qty})`,
        userEmail: "manager@verispec.local",
      });

      // Update local view
      setDetectedProduct({
        ...detectedProduct,
        inventory: {
          ...detectedProduct.inventory,
          currentStock: res.newStock,
          availableStock: Math.max(0, res.newStock - detectedProduct.inventory.reservedStock),
        },
      });

      setQuickAdjustFeedback(`Stock updated: ${res.newStock} units ✓`);
      setTimeout(() => setQuickAdjustFeedback(""), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Industrial Warehouse Scanner</h3>
              <p className="text-[11px] text-zinc-400 font-mono">1D Code-128 &bull; 2D QR Matrix Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Camera Simulation */}
        <div className="p-6 bg-zinc-900 text-white flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]">
          {/* Ambient scanner grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Scanner Reticle Frame */}
          <div className="relative w-64 h-44 rounded-2xl border-2 border-dashed border-amber-400/80 flex items-center justify-center overflow-hidden bg-black/40">
            {/* Animated Laser Sweep Line */}
            {isScanning && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-[bounce_2s_infinite]" />
            )}

            {/* Corner Bracket Graphics */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

            <div className="text-center p-3 z-10">
              <Camera className="w-6 h-6 text-zinc-400 mx-auto mb-1.5 opacity-60" />
              <span className="text-[11px] font-mono text-zinc-300 block">Align Label Inside Reticle</span>
              <span className="text-[9px] font-mono text-zinc-500">Supports Handheld Laser & Mobile Cam</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SENSOR ACTIVE &bull; 30 FPS CONTINUOUS DECODE</span>
          </div>
        </div>

        {/* Quick Simulation / Barcode Input */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1">
              Barcode / SKU Reader Feed
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={scannedInput}
                onChange={(e) => handleScanValue(e.target.value)}
                placeholder="Scan or type SKU e.g. VS-PPE-005..."
                className="flex-1 p-2.5 rounded-xl border border-zinc-200 text-xs font-mono uppercase bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {scannedInput && (
                <button
                  onClick={() => {
                    setScannedInput("");
                    setDetectedProduct(null);
                    setScanStatus("IDLE");
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-100 text-zinc-600 text-xs hover:bg-zinc-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Simulation Barcode Chips */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              1-Tap Test Simulated Bin Scans:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { sku: "VS-PPE-005", label: "Nitrile Gloves" },
                { sku: "VS-PPE-020", label: "Respirator" },
                { sku: "VS-PPE-008", label: "Safety Shoes" },
                { sku: "VS-CHM-011", label: "Caustic Soda" },
              ].map((chip) => (
                <button
                  key={chip.sku}
                  onClick={() => handleScanValue(chip.sku)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[11px] font-mono text-zinc-750 transition-colors flex items-center gap-1.5"
                >
                  <QrCode className="w-3 h-3 text-zinc-500" />
                  <span>{chip.sku}</span>
                  <span className="text-[10px] text-zinc-400">({chip.label})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scan Result Feedback */}
          {scanStatus === "SUCCESS" && detectedProduct && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Match Identified</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  {detectedProduct.sku}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {detectedProduct.imageUrl ? (
                  <img
                    src={detectedProduct.imageUrl}
                    alt={detectedProduct.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm shrink-0">
                    📦
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">{detectedProduct.name}</h4>
                  <div className="text-[11px] text-zinc-600 font-mono">
                    Bin: <strong className="text-zinc-900">{detectedProduct.inventory.locationCode}</strong> &bull; Current:{" "}
                    <strong className="text-zinc-900">{detectedProduct.inventory.currentStock} {detectedProduct.unitOfMeasure}s</strong>
                  </div>
                </div>
              </div>

              {/* 1-Tap Quick Shelf Audit Adjustments */}
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    1-Tap Shelf Adjustment:
                  </span>
                  {quickAdjustFeedback && (
                    <span className="text-[11px] font-bold text-emerald-700 font-mono">
                      {quickAdjustFeedback}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickStockAdjust("STOCK_IN", 10)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-mono text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+10 Intake</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStockAdjust("STOCK_OUT", 5)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-mono text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                    <span>-5 Dispatch</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-emerald-200/60">
                {onSelectProductForAdjustment && (
                  <button
                    onClick={() => {
                      onSelectProductForAdjustment(detectedProduct.id);
                      onClose();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Record Stock Movement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <Link
                  href={`/products/${detectedProduct.slug}`}
                  onClick={onClose}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-200"
                >
                  View Spec
                </Link>
              </div>
            </div>
          )}

          {scanStatus === "NOT_FOUND" && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>No product found matching &ldquo;{scannedInput}&rdquo;. Please verify the warehouse label.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
