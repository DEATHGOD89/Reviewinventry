import React from "react";
import Link from "next/link";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { OdooDatasheetSection } from "@/components/home/OdooDatasheetSection";
import { VisionSection } from "@/components/home/VisionSection";
import { FourExperiencesSection } from "@/components/home/FourExperiencesSection";
import { FeaturedCatalogueGrid } from "@/components/home/FeaturedCatalogueGrid";
import { CinematicFeatureSection } from "@/components/home/CinematicFeatureSection";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { INITIAL_CATEGORIES, INITIAL_19_PRODUCTS } from "@/lib/catalog-data";
import { ArrowRight, ShieldCheck, AlertTriangle, ExternalLink, SlidersHorizontal, ArrowUpRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* 1. Hero Showcase matching Reference Image 2 (Quso.ai Modern SaaS) */}
      <HeroShowcase />

      {/* 2. Live Interactive Datasheet matching Reference Image 1 (Odoo Replenishment Table) */}
      <OdooDatasheetSection />

      {/* 3. Category Filter Bar */}
      <section className="py-6 px-4 sm:px-6 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Master Categories:
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
              {INITIAL_CATEGORIES.length} Domains
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/products"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
            >
              All Items ({INITIAL_19_PRODUCTS.length})
            </Link>
            {INITIAL_CATEGORIES.map((cat) => {
              const count = INITIAL_19_PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 transition-colors flex items-center gap-1.5"
                >
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white text-slate-600 border border-slate-200">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Four Specialized Experiences in One Platform */}
      <FourExperiencesSection />

      {/* 5. Dynamic Featured Master Catalog Grid */}
      <FeaturedCatalogueGrid />

      {/* 6. Vision & 3-Angle Perspective Section */}
      <VisionSection />

      {/* 7. Cinematic Feature Section */}
      <CinematicFeatureSection />

      {/* 8. Community & Auditor Reviews Carousel */}
      <ReviewsCarousel />

      {/* 9. Bottom Modern SaaS Pre-Footer Callout */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-950 text-white text-center border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Industrial Integrity Gateway
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Experience VeriSpec Intelligence Today
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Gain immediate insight into warehouse telemetry, verified PPE standards, and chemical safety documentation.
            Explore our complete 19-product master catalogue now.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-purple font-bold text-xs shadow-xl transition-all group"
            >
              <span>Explore Master Catalogue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/management"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              <span>Management Portal</span>
              <ArrowUpRight className="w-4 h-4 text-slate-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
