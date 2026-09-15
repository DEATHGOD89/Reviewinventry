"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { INITIAL_CATEGORIES, ProductItem } from "@/lib/catalog-data";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { recordInventoryAdjustment } from "@/lib/services/inventory";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { TrustScoreBadge } from "@/components/ui/TrustScoreBadge";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { convertFromInr } from "@/lib/services/currency";
import { ProductFinderWizard } from "@/components/discovery/ProductFinderWizard";
import { WarehouseLabelModal } from "@/components/ui/WarehouseLabelModal";
import { SpecSheetModal } from "@/components/ui/SpecSheetModal";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Compass,
  LayoutGrid,
  Table as TableIcon,
  QrCode,
  FileText,
  Plus,
  Square,
  CheckSquare,
  Package,
} from "lucide-react";

export default function ProductCataloguePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTrigger, setSelectedTrigger] = useState<"all" | "low_stock">("all");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"datasheet" | "grid">("datasheet");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modals state
  const [selectedLabelProduct, setSelectedLabelProduct] = useState<ProductItem | null>(null);
  const [selectedSpecProduct, setSelectedSpecProduct] = useState<ProductItem | null>(null);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<ProductItem | null>(null);
  const [adjustType, setAdjustType] = useState<"STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT">("STOCK_IN");
  const [adjustQty, setAdjustQty] = useState<number>(20);
  const [adjustReason, setAdjustReason] = useState<string>("");
  const [adjustFeedback, setAdjustFeedback] = useState<string>("");

  useEffect(() => {
    setAllProducts(getAllDynamicProducts());
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Trigger filter
      if (selectedTrigger === "low_stock" && p.inventory.currentStock > p.inventory.minStock) {
        return false;
      }

      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || p.categorySlug === selectedCategory;

      // Status filter
      const matchesStatus =
        selectedStatus === "all" || p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allProducts, searchQuery, selectedCategory, selectedStatus, selectedTrigger]);

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

      setAllProducts((prev) =>
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
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Master Catalogue &amp; Odoo-Style Replenishment Datasheet</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Industrial Master Catalogue
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            19 master products across PPE, Chemical Hygiene, and Waste Containment.
            Indicative reference pricing only &bull; zero online payments or checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Switcher: Datasheet (Odoo) vs Grid */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("datasheet")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "datasheet"
                  ? "bg-white text-slate-950 shadow-2xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
              title="Spreadsheet Datasheet View"
            >
              <TableIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>Datasheet</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white text-slate-950 shadow-2xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
              title="Product Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cards</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowWizard(!showWizard)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              showWizard
                ? "bg-indigo-700 text-white"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-300" />
            <span>{showWizard ? "Hide Wizard" : "Product Finder Wizard"}</span>
          </button>

          <div className="flex items-center gap-2">
            <CurrencySelector
              currentCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
            />
          </div>
        </div>
      </div>

      {/* Guided Product Finder Wizard */}
      {showWizard && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-200">
          <ProductFinderWizard />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, SKU, category, or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs font-medium"
          >
            <option value="all">All Categories ({allProducts.length})</option>
            {INITIAL_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Verification Status */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs font-medium"
          >
            <option value="all">All Verification Statuses</option>
            <option value="DRAFT">Draft Records ({allProducts.filter((p) => p.status === "DRAFT").length})</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="ACTIVE">Active Records</option>
          </select>
        </div>

        {/* Trigger Filter Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedTrigger(selectedTrigger === "all" ? "low_stock" : "all")}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedTrigger === "low_stock"
                ? "bg-amber-50 text-amber-900 border-amber-300"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Low Stock ({allProducts.filter((p) => p.inventory.currentStock <= p.inventory.minStock).length})</span>
          </button>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>
          Showing <strong>{filteredProducts.length}</strong> of {allProducts.length} master products
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
          All seeded records require manufacturer verification
        </span>
      </div>

      {/* VIEW MODE 1: Odoo Replenishment Datasheet View (Default) */}
      {viewMode === "datasheet" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-3 w-10 text-center">
                    <button onClick={handleSelectAll} className="p-0.5 text-slate-400 hover:text-slate-700">
                      {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Product Name &amp; SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Warehouse</th>
                  <th className="py-3 px-3 text-right">On Hand</th>
                  <th className="py-3 px-3 text-right">Available</th>
                  <th className="py-3 px-3 text-right">Min</th>
                  <th className="py-3 px-3 text-right">Reorder</th>
                  <th className="py-3 px-3">UoM</th>
                  <th className="py-3 px-3">Trust Score</th>
                  <th className="py-3 px-3 text-right">Indicative Ref</th>
                  <th className="py-3 px-4 text-center">Actions</th>
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
                            <span className="text-[10px] font-mono text-slate-400 block">
                              {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]">
                        {p.categoryName}
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                        {p.inventory.locationCode}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span
                          className={`font-mono font-bold text-xs ${
                            isLow ? "text-amber-700 font-extrabold" : "text-slate-900"
                          }`}
                        >
                          {p.inventory.currentStock.toLocaleString()}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {p.inventory.availableStock.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        {p.inventory.minStock}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {p.inventory.reorderQty}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {p.unitOfMeasure}
                      </td>

                      <td className="py-3 px-3">
                        <TrustScoreBadge product={p} size="sm" />
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                        {convertedPrice.formatted}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setAdjustProduct(p);
                              setAdjustQty(p.inventory.reorderQty);
                              setAdjustModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-md bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-[11px] transition-colors"
                            title="Perform Stock Movement"
                          >
                            Adjust
                          </button>

                          <button
                            onClick={() => setSelectedSpecProduct(p)}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-950 transition-colors"
                            title="Technical Datasheet (TDS PDF)"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedLabelProduct(p)}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-950 transition-colors"
                            title="Print Warehouse Bin/Shelf Label"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

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
      )}

      {/* VIEW MODE 2: Card Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const convertedPrice = convertFromInr(p.indicativePriceInr, selectedCurrency);

            return (
              <div
                key={p.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group overflow-hidden"
              >
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden border-b border-slate-100">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-mono text-xs">
                      Photo Pending
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
                      {p.sku}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <VerificationBadge status={p.status} confidence={p.dataConfidenceLevel} />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between gap-2 mt-1 mb-2">
                      <span className="text-xs text-slate-400 font-medium">{p.categoryName}</span>
                      <TrustScoreBadge product={p} size="sm" />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-2">
                      {p.shortDescription}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-slate-500 font-mono">
                        Stock: <strong className="text-slate-900">{p.inventory.currentStock}</strong> {p.unitOfMeasure}s
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-950">
                          {convertedPrice.formatted}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">indicative ref</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      href={`/products/${p.slug}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold text-center hover:bg-slate-800 transition-colors"
                    >
                      View Full Specs
                    </Link>

                    <button
                      onClick={() => setSelectedLabelProduct(p)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Print Label"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href={`/compare?p1=${p.slug}`}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      title="Compare"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                    placeholder="e.g. Monthly replenishment intake verified by warehouse lead"
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
    </div>
  );
}
