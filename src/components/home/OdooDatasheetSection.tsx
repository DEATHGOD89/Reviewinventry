"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProductItem, INITIAL_CATEGORIES } from "@/lib/catalog-data";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { recordInventoryAdjustment } from "@/lib/services/inventory";
import { convertFromInr } from "@/lib/services/currency";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";
import { WarehouseLabelModal } from "@/components/ui/WarehouseLabelModal";
import { SpecSheetModal } from "@/components/ui/SpecSheetModal";
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink,
  QrCode,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  Check,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  Sliders,
  CheckSquare,
  Square,
  Package,
} from "lucide-react";

interface OdooDatasheetSectionProps {
  initialProducts?: ProductItem[];
  compact?: boolean;
}

export const OdooDatasheetSection: React.FC<OdooDatasheetSectionProps> = ({
  initialProducts,
  compact = false,
}) => {
  const [products, setProducts] = useState<ProductItem[]>(
    initialProducts || getAllDynamicProducts()
  );
  const [activeSubTab, setActiveSubTab] = useState<
    "Replenishment" | "Operations" | "Products" | "Reporting"
  >("Replenishment");
  const [activeTrigger, setActiveTrigger] = useState<"all" | "manual" | "low_stock">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");

  // Quick Adjustment Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<ProductItem | null>(null);
  const [adjustType, setAdjustType] = useState<"STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT">("STOCK_IN");
  const [adjustQty, setAdjustQty] = useState<number>(20);
  const [adjustReason, setAdjustReason] = useState<string>("");
  const [adjustFeedback, setAdjustFeedback] = useState<string>("");

  // Label & Spec modals
  const [selectedLabelProduct, setSelectedLabelProduct] = useState<ProductItem | null>(null);
  const [selectedSpecProduct, setSelectedSpecProduct] = useState<ProductItem | null>(null);

  // Filtered dataset
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Trigger filter
      if (activeTrigger === "low_stock") {
        if (p.inventory.currentStock > p.inventory.minStock) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchCat = p.categoryName.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchCat) return false;
      }

      return true;
    });
  }, [products, activeTrigger, selectedCategory, searchQuery]);

  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleQuickAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProduct) return;
    if (!adjustReason || adjustReason.trim().length < 5) {
      alert("A mandatory reason of at least 5 characters is required.");
      return;
    }

    try {
      const res = await recordInventoryAdjustment({
        productId: adjustProduct.id,
        movementType: adjustType,
        quantity: adjustQty,
        mandatoryReason: adjustReason,
        userEmail: "operations@verispec.local",
      });

      // Update local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === adjustProduct.id
            ? {
                ...p,
                inventory: {
                  ...p.inventory,
                  currentStock: res.newStock,
                  availableStock: Math.max(0, res.newStock - p.inventory.reservedStock),
                },
              }
            : p
        )
      );

      setAdjustFeedback(`✓ ${adjustProduct.name} stock updated to ${res.newStock} units`);
      setTimeout(() => {
        setAdjustModalOpen(false);
        setAdjustFeedback("");
        setAdjustReason("");
      }, 1800);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <section id="datasheet" className="py-12 bg-white border-y border-slate-200/90 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200/60">
              <Package className="w-3.5 h-3.5 text-purple-600" />
              <span>Real-Time Warehouse Replenishment Engine</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Interactive Inventory Master Datasheet
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Live telemetry tracking on-hand stock, min/max reorder rules, and verified specifications across WH-MAIN-01 and WH-CHEM-02.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/management"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Replenishment</span>
            </Link>
          </div>
        </div>

        {/* Odoo Card Container */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xl overflow-hidden">
          {/* Odoo Top Bar */}
          <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left Sub-tabs */}
            <div className="flex items-center gap-1">
              {(["Replenishment", "Operations", "Products", "Reporting"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    activeSubTab === tab
                      ? "bg-white text-purple-900 shadow-2xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Middle Search & Tags */}
            <div className="flex-1 max-w-md relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search product, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-2xs"
              />
            </div>

            {/* Pagination & Count */}
            <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
              <span>
                1-{filteredProducts.length} / {products.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTrigger("all")}
                  className={`px-2.5 py-1 rounded-md font-semibold text-[11px] border ${
                    activeTrigger === "all"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setActiveTrigger("low_stock")}
                  className={`px-2.5 py-1 rounded-md font-semibold text-[11px] border ${
                    activeTrigger === "low_stock"
                      ? "bg-amber-50 text-amber-800 border-amber-300 font-bold"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  Low Stock Alert ({products.filter((p) => p.inventory.currentStock <= p.inventory.minStock).length})
                </button>
              </div>
            </div>
          </div>

          {/* Odoo Main Grid Area: Left Sidebar + Right Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Filter Sidebar */}
            <div className="lg:col-span-2 p-4 border-r border-slate-200 bg-slate-50/40 text-xs space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Trigger Filter
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTrigger("all")}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between font-medium transition-colors ${
                      activeTrigger === "all"
                        ? "bg-purple-100/70 text-purple-950 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Master Items</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white border border-slate-200">
                      {products.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTrigger("low_stock")}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between font-medium transition-colors ${
                      activeTrigger === "low_stock"
                        ? "bg-amber-100/70 text-amber-950 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Needs Reorder</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                      {products.filter((p) => p.inventory.currentStock <= p.inventory.minStock).length}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Category Domains
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between font-medium transition-colors ${
                      selectedCategory === "all"
                        ? "bg-purple-100/70 text-purple-950 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Domains</span>
                  </button>
                  {INITIAL_CATEGORIES.slice(0, 6).map((cat) => {
                    const count = products.filter((p) => p.categorySlug === cat.slug).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between font-medium transition-colors truncate ${
                          selectedCategory === cat.slug
                            ? "bg-purple-100/70 text-purple-950 font-bold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate pr-1">{cat.name}</span>
                        {count > 0 && (
                          <span className="text-[10px] font-mono shrink-0 px-1 rounded bg-white border border-slate-200">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                <span className="font-semibold block text-slate-700 mb-1">Zero-Store Notice</span>
                Indicative reference only. Direct checkouts disabled by policy.
              </div>
            </div>

            {/* Right Spreadsheet Table */}
            <div className="lg:col-span-10 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-3 w-10 text-center">
                      <button onClick={handleSelectAll} className="p-0.5 text-slate-400 hover:text-slate-700">
                        {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-3">Product Name & SKU</th>
                    <th className="py-3 px-3">Warehouse</th>
                    <th className="py-3 px-3 text-right">On Hand</th>
                    <th className="py-3 px-3 text-right">Forecast</th>
                    <th className="py-3 px-3 text-right">Min</th>
                    <th className="py-3 px-3 text-right">Reorder</th>
                    <th className="py-3 px-3">UoM</th>
                    <th className="py-3 px-3">Trust Grade</th>
                    <th className="py-3 px-3 text-right">Indicative Ref</th>
                    <th className="py-3 px-4 text-center">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isLow = p.inventory.currentStock <= p.inventory.minStock;
                    const isSelected = selectedProductIds.includes(p.id);
                    const convertedPrice = convertFromInr(p.indicativePriceInr, selectedCurrency);

                    return (
                      <tr
                        key={p.id}
                        className={`transition-colors hover:bg-purple-50/30 ${
                          isSelected ? "bg-purple-50/50" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleToggleSelect(p.id)}
                            className="p-0.5 text-slate-400 hover:text-slate-700"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Product Name & SKU */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 text-xs">
                                📦
                              </div>
                            )}
                            <div className="min-w-0">
                              <Link
                                href={`/products/${p.slug}`}
                                className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block truncate"
                              >
                                {p.name}
                              </Link>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                                <span>{p.sku}</span>
                                <span>&bull;</span>
                                <span className="truncate">{p.categoryName}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Warehouse Location */}
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                          {p.inventory.locationCode}
                        </td>

                        {/* On Hand */}
                        <td className="py-3 px-3 text-right">
                          <span
                            className={`font-mono font-bold text-xs ${
                              isLow ? "text-amber-700 font-extrabold" : "text-slate-900"
                            }`}
                          >
                            {p.inventory.currentStock.toLocaleString()}
                          </span>
                        </td>

                        {/* Forecast / Available */}
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {p.inventory.availableStock.toLocaleString()}
                        </td>

                        {/* Min Stock */}
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          {p.inventory.minStock}
                        </td>

                        {/* Reorder Qty */}
                        <td className="py-3 px-3 text-right font-mono text-slate-500">
                          {p.inventory.reorderQty}
                        </td>

                        {/* UoM */}
                        <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                          {p.unitOfMeasure}
                        </td>

                        {/* Trust Grade */}
                        <td className="py-3 px-3">
                          <TrustScoreBadge product={p} size="sm" />
                        </td>

                        {/* Indicative Price */}
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                          {convertedPrice.formatted}
                        </td>

                        {/* Operational Actions */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Stock Adjustment Trigger */}
                            <button
                              onClick={() => {
                                setAdjustProduct(p);
                                setAdjustQty(p.inventory.reorderQty);
                                setAdjustModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-md bg-purple-100/80 hover:bg-purple-200 text-purple-950 font-bold text-[11px] transition-colors"
                              title="Perform Stock Movement"
                            >
                              Adjust
                            </button>

                            {/* View Specs TDS */}
                            <button
                              onClick={() => setSelectedSpecProduct(p)}
                              className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-950 transition-colors"
                              title="Technical Datasheet (TDS PDF)"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {/* Thermal Bin Label */}
                            <button
                              onClick={() => setSelectedLabelProduct(p)}
                              className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-950 transition-colors"
                              title="Print Warehouse Bin/Shelf Label"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>

                            {/* External Seller Link */}
                            {p.externalPurchaseLinks?.[0] && (
                              <a
                                href={p.externalPurchaseLinks[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-md hover:bg-slate-100 text-indigo-600 hover:text-indigo-800 transition-colors"
                                title={`Buy from verified external seller (${p.externalPurchaseLinks[0].sellerName})`}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Odoo Footer Bar */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>
                Total Records: <strong>{filteredProducts.length}</strong>
              </span>
              <span>
                Total Units on Hand:{" "}
                <strong>
                  {filteredProducts.reduce((sum, p) => sum + p.inventory.currentStock, 0).toLocaleString()}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Immutable audit trail enforced on all warehouse adjustments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stock Adjustment Modal */}
      {adjustModalOpen && adjustProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Record Stock Movement</h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {adjustProduct.name} ({adjustProduct.sku})
                </p>
              </div>
              <button
                onClick={() => setAdjustModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            {adjustFeedback ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                {adjustFeedback}
              </div>
            ) : (
              <form onSubmit={handleQuickAdjustSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Movement Type</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium"
                  >
                    <option value="STOCK_IN">Stock In (Replenishment Delivery)</option>
                    <option value="STOCK_OUT">Stock Out (Dispatched / Consumed)</option>
                    <option value="ADJUSTMENT">Cycle Count Reconciliation</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Mandatory Reason (Min 5 chars) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Monthly batch count verification by warehouse lead"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold"
                  >
                    Confirm Movement
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Warehouse Label Modal */}
      <WarehouseLabelModal
        product={selectedLabelProduct}
        isOpen={!!selectedLabelProduct}
        onClose={() => setSelectedLabelProduct(null)}
      />

      {/* Technical Spec Sheet (TDS PDF) Modal */}
      {selectedSpecProduct && (
        <SpecSheetModal
          product={selectedSpecProduct}
          isOpen={!!selectedSpecProduct}
          onClose={() => setSelectedSpecProduct(null)}
        />
      )}
    </section>
  );
};
