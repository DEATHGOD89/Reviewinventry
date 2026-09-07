"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductItem } from "@/lib/catalog-data";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { SlidersHorizontal, Plus, X, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";

export default function ProductComparePage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 text-center text-xs text-zinc-500 font-mono">
          Loading comparison matrix...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const allProducts = getAllDynamicProducts();

  useEffect(() => {
    const p1 = searchParams.get("p1");
    const p2 = searchParams.get("p2");
    const initial: string[] = [];
    if (p1 && allProducts.some((p) => p.slug === p1)) initial.push(p1);
    if (p2 && allProducts.some((p) => p.slug === p2)) initial.push(p2);
    if (initial.length === 0) {
      initial.push("nitrile-gloves", "chemical-gloves");
    }
    setSelectedSlugs(initial);
  }, [searchParams]);

  const selectedProducts: ProductItem[] = selectedSlugs
    .map((s) => allProducts.find((p) => p.slug === s))
    .filter((p): p is ProductItem => p !== undefined);

  // Extract all unique custom specification attributes across currently compared products
  const allCustomSpecKeys = Array.from(
    new Set(
      selectedProducts.flatMap((p) =>
        (p.customAttributes || []).map((attr) => attr.key.trim())
      )
    )
  ).filter(Boolean);

  const addProduct = (slug: string) => {
    if (selectedSlugs.length < 4 && !selectedSlugs.includes(slug)) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  const removeProduct = (slug: string) => {
    setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
  };

  const clearAll = () => {
    setSelectedSlugs([]);
  };

  return (
    <div className="pt-28 pb-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-900" />
          <span>Side-by-Side Spec Matrix &bull; Up to 4 Items</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
          Product Comparison Matrix
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
          Compare physical characteristics, chemical attributes, safety standards, and indicative pricing across master catalogue records.
        </p>
      </div>

      {/* Product Selection Tray */}
      <div className="p-4 rounded-3xl bg-white border border-zinc-200 mb-8 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-zinc-700">Add to Compare:</span>
        <select
          onChange={(e) => {
            if (e.target.value) addProduct(e.target.value);
            e.target.value = "";
          }}
          className="text-xs px-4 py-2 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          disabled={selectedSlugs.length >= 4}
        >
          <option value="">-- Choose from Master Products ({allProducts.length}) --</option>
          {allProducts.filter((p) => !selectedSlugs.includes(p.slug)).map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name} ({p.categoryName})
            </option>
          ))}
        </select>
        <span className="text-[11px] text-zinc-400 font-mono">
          ({selectedSlugs.length}/4 Selected)
        </span>
        {selectedSlugs.length > 0 && (
          <button
            onClick={clearAll}
            className="text-[11px] px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-semibold transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Comparison Table */}
      {selectedProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-zinc-200 text-zinc-500 text-xs">
          Select at least one product to begin comparison.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl bg-white border border-zinc-200 shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="p-4 w-48 font-bold text-zinc-700">Specification</th>
                {selectedProducts.map((p) => (
                  <th key={p.id} className="p-4 min-w-[220px] font-bold text-zinc-900 border-l border-zinc-200">
                    <div className="flex items-center justify-between">
                      <span>{p.name}</span>
                      <button
                        onClick={() => removeProduct(p.slug)}
                        className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200"
                        title="Remove product"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-normal font-mono">{p.sku}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              <tr>
                <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">Product Photo</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-zinc-200">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                          No Photo
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">Category</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-zinc-200 text-zinc-800">
                    {p.categoryName}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">Verification Status</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-zinc-200">
                    <VerificationBadge status={p.status} confidence={p.dataConfidenceLevel} />
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">Unit of Measure</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-zinc-200 font-mono text-zinc-800">
                    {p.unitOfMeasure}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">Current Stock</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-zinc-200 font-mono text-zinc-800">
                    {p.inventory.currentStock} {p.unitOfMeasure}s ({p.inventory.locationCode})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">Indicative Price (Ref)</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-zinc-200 font-bold text-zinc-950">
                    ₹{p.indicativePriceInr.toFixed(2)} INR
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">PPE Standards</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-zinc-200 text-zinc-700">
                    {p.ppeDetail ? p.ppeDetail.applicableStandards : "N/A (Non-PPE)"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">Chemical Hazard Class</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-zinc-200 text-zinc-700">
                    {p.chemicalDetail ? p.chemicalDetail.hazardClassification : "N/A (Non-Chemical)"}
                  </td>
                ))}
              </tr>

              {/* Dynamic Custom Technical Specifications Rows */}
              {allCustomSpecKeys.map((specKey) => (
                <tr key={specKey}>
                  <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">
                    {specKey}
                  </td>
                  {selectedProducts.map((p) => {
                    const match = p.customAttributes?.find(
                      (attr) => attr.key.trim().toLowerCase() === specKey.toLowerCase()
                    );
                    return (
                      <td key={p.id} className="p-4 border-l border-zinc-200 text-zinc-800 font-mono">
                        {match ? match.value : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr>
                <td className="p-4 font-semibold text-zinc-600 bg-zinc-50/50">Detailed View</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 border-l border-zinc-200">
                    <Link
                      href={`/products/${p.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-zinc-950 hover:underline"
                    >
                      <span>Full Specifications</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
