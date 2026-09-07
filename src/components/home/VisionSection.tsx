"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldAlert, FileCheck, Layers, Beaker } from "lucide-react";

export const VisionSection: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems = [
    {
      title: "Chemical Safety & SDS Verification",
      category: "Hazard Protection",
      description:
        "Every chemical product like Caustic Soda, Suma Det., and Divo Flow strictly requires verified manufacturer SDS submissions before publication of health claims or hazard classifications.",
      badge: "Strict SDS Gate",
      href: "/products/caustic-soda",
      icon: Beaker,
      image: "/images/hero_hazardous.jpg",
    },
    {
      title: "PPE Barrier & Mechanical Testing",
      category: "Personal Protective Equipment",
      description:
        "From Nitrile and Chemical gloves to Safety Shoes and Dielectric Electrical gloves, all protective ratings must be backed by documented EN ISO standards.",
      badge: "ISO Standard Check",
      href: "/products/chemical-gloves",
      icon: Layers,
      image: "/images/hero_gloves.jpg",
    },
    {
      title: "Multi-Warehouse Inventory Control",
      category: "Operational Intelligence",
      description:
        "Trace stock in, stock out, and mandatory-reason adjustments across Central Warehouses and Hazardous Containment Depots with immutable audit logs.",
      badge: "Real-time Telemetry",
      href: "/management",
      icon: FileCheck,
      image: "/images/hero_respirator.jpg",
    },
  ];

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const currentItem = carouselItems[carouselIndex];
  const IconComponent = currentItem.icon;

  return (
    <section className="py-20 px-6 bg-[#f5f5f8] border-t border-zinc-200/80">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-zinc-900 leading-snug">
          We believe safety starts with clarity.
          <br />
          <span className="text-zinc-500 font-normal">
            Our platform is engineered to eliminate fabricated claims, offering verifiable specifications, audit logs, and authentic community reviews.
          </span>
        </h2>
      </div>

      {/* 3-Angle Perspective Carousel - Visora Style */}
      <div className="max-w-5xl mx-auto">
        <div className="relative p-8 md:p-12 rounded-3xl bg-white border border-zinc-200 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-800">
              <IconComponent className="w-3.5 h-3.5 text-zinc-900" />
              <span>{currentItem.badge}</span>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center justify-center transition-colors"
                aria-label="Previous slide"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition-colors"
                aria-label="Next slide"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {currentItem.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 mt-1">
                {currentItem.title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mt-3">
                {currentItem.description}
              </p>

              <div className="mt-6 flex items-center gap-4">
                <Link
                  href={currentItem.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-850 transition-colors"
                >
                  <span>Inspect Master Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/safety"
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 underline underline-offset-4"
                >
                  Read Safety Rules
                </Link>
              </div>
            </div>

            {/* Stylized Visual Mockup Card with Real Photo */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white border border-zinc-800 shadow-2xl aspect-[4/3] group">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/50 pointer-events-none" />

              {/* Top HUD */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between text-xs text-zinc-300 font-mono z-10">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15">
                  VERISPEC TELEMETRY
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-400/30 font-bold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AUDIT ACTIVE</span>
                </span>
              </div>

              {/* Center Content */}
              <div className="absolute inset-x-4 bottom-4 z-10 bg-black/75 backdrop-blur-md p-4 rounded-xl border border-white/15">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">{currentItem.title}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-300 font-mono mt-1 pt-2 border-t border-white/10">
                  <span>Standard: {currentItem.badge}</span>
                  <span className="text-amber-300">Phase 1 Controlled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
