"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { ProductItem } from "@/lib/catalog-data";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { convertFromInr } from "@/lib/services/currency";
import {
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  Edit2,
  Package,
} from "lucide-react";
import { ProductEditModal } from "@/components/management/ProductEditModal";

export const FeaturedCatalogueGrid: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    setProducts(getAllDynamicProducts());
  }, []);

  const featured = products.slice(0, 6);

  return (
    <section className="py-20 px-6 bg-[#f7f7fa] border-t border-zinc-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>
                {products.length > 0 ? `${products.length} Master Items` : "19 Initial Products"} • Rigorously Tracked
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
              Master Product Catalogue
            </h2>
            <p className="text-xs md:text-sm text-zinc-500 mt-1 max-w-xl">
              Zero fabricated claims. All chemical specs, standards, and safety instructions remain pending until verified by manufacturer documentation.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
              <span>Currency:</span>
              <CurrencySelector
                currentCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
              />
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-900 hover:text-zinc-600 underline underline-offset-4"
            >
              <span>View All ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grid of 6 Featured Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => {
            const displayPrice = convertFromInr(p.indicativePriceInr, selectedCurrency);

            return (
              <div
                key={p.id}
                className="rounded-3xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all flex flex-col justify-between group overflow-hidden"
              >
                {/* Product Image Header */}
                <div className="relative w-full h-48 bg-zinc-100 overflow-hidden border-b border-zinc-100">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 font-mono text-xs">
                      📦 Photo Pending
                    </div>
                  )}

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white font-semibold shadow-xs">
                      {p.sku}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50/90 backdrop-blur-md text-amber-900 border border-amber-300 shadow-xs">
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span>{p.categoryName}</span>
                      <span className="font-mono text-[11px] text-zinc-500">
                        Loc: {p.inventory.locationCode}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-950 tracking-tight group-hover:text-zinc-700 transition-colors">
                      {p.name}
                    </h3>

                    <p className="text-xs text-zinc-600 leading-relaxed mt-2 line-clamp-2">
                      {p.shortDescription}
                    </p>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span>
                        Stock:{" "}
                        <strong className="text-zinc-800">
                          {p.inventory.currentStock} {p.unitOfMeasure}s
                        </strong>
                      </span>
                      <span className="text-zinc-900 font-bold">
                        {displayPrice.formatted} ref
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/products/${p.slug}`}
                      className="flex-1 py-2 px-3 rounded-full bg-zinc-950 text-white text-xs font-semibold text-center hover:bg-zinc-850 transition-colors shadow-2xs"
                    >
                      Inspect Specs
                    </Link>

                    <Link
                      href={`/compare?p1=${p.slug}`}
                      className="p-2 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
                      title="Compare with another product"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(p);
                        setEditModalOpen(true);
                      }}
                      className="p-2 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
                      title="Edit specifications (Staff / Owner)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal Hookup */}
      {editingProduct && (
        <ProductEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingProduct(null);
          }}
          onSaved={(updatedList) => {
            setProducts(updatedList);
          }}
          productToEdit={editingProduct}
          currentUserEmail="manager@verispec.local"
        />
      )}
    </section>
  );
};
