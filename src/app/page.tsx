import React from "react";
import Link from "next/link";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { VisionSection } from "@/components/home/VisionSection";
import { FeaturedCatalogueGrid } from "@/components/home/FeaturedCatalogueGrid";
import { CinematicFeatureSection } from "@/components/home/CinematicFeatureSection";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { INITIAL_CATEGORIES, INITIAL_19_PRODUCTS } from "@/lib/catalog-data";
import { ArrowRight, ShieldCheck, AlertTriangle, ExternalLink, SlidersHorizontal, ArrowUpRight } from "lucide-react";

export default function HomePage() {

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Showcase matching Reference Image */}
      <HeroShowcase />

      {/* 2. Category Filter Bar (Visora Category Bar) */}
      <section className="py-6 px-6 bg-white border-y border-zinc-200/80">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Master Categories:
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {INITIAL_CATEGORIES.length} Domains
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/products"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 transition-colors shadow-2xs"
            >
              All Items ({INITIAL_19_PRODUCTS.length})
            </Link>
            {INITIAL_CATEGORIES.map((cat) => {
              const count = INITIAL_19_PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950 transition-colors flex items-center gap-1.5"
                >
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white text-zinc-600 border border-zinc-200">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Vision & 3-Angle Perspective Section */}
      <VisionSection />

      {/* 4. Dynamic Featured Master Catalog Grid */}
      <FeaturedCatalogueGrid />

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
