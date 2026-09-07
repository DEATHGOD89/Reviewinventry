"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { INITIAL_CATEGORIES, ProductItem } from "@/lib/catalog-data";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { convertFromInr } from "@/lib/services/currency";
import { Search, Filter, SlidersHorizontal, ArrowRight, ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";

export default function ProductCataloguePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    setAllProducts(getAllDynamicProducts());
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
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
  }, [allProducts, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
              <span>Full Master Catalogue &bull; Strict Zero-Hallucination Policy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
              Product Catalogue
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
              Explore our master registry of products across PPE, Chemical Hygiene, and Waste Management.
              Indicative pricing is provided for reference only; users cannot buy directly from this platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-medium">Display Currency:</span>
            <CurrencySelector
              currentCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, SKU, category, or specifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
          >
            <option value="all">All Categories ({allProducts.length})</option>
            {INITIAL_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
          >
            <option value="all">All Verification Statuses</option>
            <option value="DRAFT">Draft Records ({allProducts.filter(p => p.status === "DRAFT").length})</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="ACTIVE">Active Records</option>
          </select>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-zinc-500 mb-6 font-mono">
        <span>
          Showing <strong>{filteredProducts.length}</strong> of {allProducts.length} master products
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
          All seeded records require manufacturer verification
        </span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const convertedPrice = convertFromInr(p.indicativePriceInr, selectedCurrency);

          return (
            <div
              key={p.id}
              className="rounded-3xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all flex flex-col justify-between group overflow-hidden"
            >
              {/* Product Photo Header */}
              <div className="relative w-full h-52 bg-zinc-100 overflow-hidden border-b border-zinc-100">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 font-mono text-xs">
                    Industrial Photo Pending
                  </div>
                )}

                {/* Floating Tags on Photo */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white shadow-xs">
                    {p.sku}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <VerificationBadge status={p.status} confidence={p.dataConfidenceLevel} />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-950 tracking-tight group-hover:text-cyan-900 transition-colors">
                    {p.name}
                  </h3>
                  <div className="text-xs text-zinc-400 mt-0.5 font-medium">{p.categoryName}</div>

                  <p className="text-xs text-zinc-600 leading-relaxed mt-3 line-clamp-2">
                    {p.shortDescription}
                  </p>

                  {/* Specifics Tag */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.ppeDetail && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                        PPE: {p.ppeDetail.isReusable ? "Reusable" : "Disposable"}
                      </span>
                    )}
                    {p.chemicalDetail && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                        Form: {p.chemicalDetail.productForm}
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                      UOM: {p.unitOfMeasure}
                    </span>
                  </div>

                  {/* Stock & Indicative Pricing */}
                  <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <div className="text-zinc-500 font-mono">
                      Stock: <strong className="text-zinc-800">{p.inventory.currentStock}</strong> {p.unitOfMeasure}s
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-zinc-950">
                        {convertedPrice.formatted}
                      </span>
                      <span className="text-[10px] text-zinc-400 block">indicative ref</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2">
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex-1 py-2 px-4 rounded-full bg-zinc-950 text-white text-xs font-semibold text-center hover:bg-zinc-800 transition-colors"
                  >
                    View Full Specs
                  </Link>

                  <Link
                    href={`/compare?p1=${p.slug}`}
                    className="p-2.5 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
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
    </div>
  );
}
