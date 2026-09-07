import React from "react";
import Link from "next/link";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { VisionSection } from "@/components/home/VisionSection";
import { CinematicFeatureSection } from "@/components/home/CinematicFeatureSection";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { INITIAL_CATEGORIES, INITIAL_19_PRODUCTS } from "@/lib/catalog-data";
import { ArrowRight, ShieldCheck, AlertTriangle, ExternalLink, SlidersHorizontal, ArrowUpRight } from "lucide-react";

export default function HomePage() {
  const featuredProducts = INITIAL_19_PRODUCTS.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Showcase matching Reference Image */}
      <HeroShowcase />

      {/* 2. Category Filter Bar (Visora Category Bar) */}
      <section className="py-8 px-6 bg-white border-y border-zinc-200/80">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Initial Master Taxonomy
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {INITIAL_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Vision & 3-Angle Perspective Section */}
      <VisionSection />

      {/* 4. Featured Master Catalog Grid */}
      <section className="py-20 px-6 bg-[#f7f7fa]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>19 Initial Products &bull; Seeded as Draft Records</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Master Product Catalogue
              </h2>
              <p className="text-xs md:text-sm text-zinc-500 mt-1">
                Zero fabricated claims. All chemical specs, standards, and safety instructions remain pending until verified by manufacturer documentation.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-900 hover:text-zinc-600 underline underline-offset-4"
            >
              <span>View All 19 Master Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grid of 6 Featured Draft Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
                      {p.sku}
                    </span>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-950 tracking-tight group-hover:text-zinc-700 transition-colors">
                    {p.name}
                  </h3>
                  <div className="text-xs text-zinc-400 mt-0.5">{p.categoryName}</div>

                  <p className="text-xs text-zinc-600 leading-relaxed mt-3 line-clamp-2">
                    {p.shortDescription}
                  </p>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>Stock: {p.inventory.currentStock} {p.unitOfMeasure}s</span>
                    <span className="text-zinc-800 font-bold">₹{p.indicativePriceInr.toFixed(2)} ref</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex-1 py-2 px-3 rounded-full bg-zinc-900 text-white text-xs font-semibold text-center hover:bg-zinc-800 transition-colors"
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Cinematic Feature Section (Dark Section from reference image) */}
      <CinematicFeatureSection />

      {/* 6. Community & Auditor Reviews Carousel */}
      <ReviewsCarousel />

      {/* 7. Bottom Futuristic Pre-Footer Callout - "Experience The Future Today" */}
      <section className="py-20 px-6 bg-[#08080a] text-white text-center border-t border-zinc-800">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Industrial Integrity Gateway
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Experience The Future Today
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Gain immediate insight into warehouse telemetry, verified PPE standards, and chemical safety documentation.
            Explore our complete 19-product master catalogue now.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-zinc-950 font-bold text-xs shadow-xl hover:bg-zinc-100 transition-all group"
            >
              <span>Explore Master Catalogue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/management"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900 text-white font-semibold text-xs border border-zinc-700 hover:bg-zinc-800 transition-colors"
            >
              <span>Management Portal</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
