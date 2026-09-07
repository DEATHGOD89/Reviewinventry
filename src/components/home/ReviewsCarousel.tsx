"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ArrowLeft, ArrowRight, Quote, ShieldCheck, UserCheck } from "lucide-react";
import { getAllReviewsForModeration } from "@/lib/services/reviews";

export const ReviewsCarousel: React.FC = () => {
  const reviews = getAllReviewsForModeration().filter((r) => r.status === "APPROVED");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const activeReview = reviews[currentIndex] || {
    reviewerName: "Verified Industrial Auditor",
    productName: "Nitrile gloves",
    rating: 5,
    title: "Objective and verifiable product information",
    content: "The platform's refusal to invent compliance ratings until formal SDS sheets are uploaded provides peace of mind for our plant safety inspections.",
    pros: "Zero fabricated claims, transparent draft tags",
    cons: "Pending manufacturer uploads",
    useCase: "Cleanroom compliance audits",
  };

  return (
    <section className="py-24 px-6 bg-white border-t border-zinc-200">
      <div className="max-w-4xl mx-auto text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Auditor & Community Assessments
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 mt-2">
          Happier with Every Decision
          <br />
          <span className="text-zinc-400 font-normal">
            After Evaluating with VeriSpec
          </span>
        </h2>
        <p className="mt-3 text-xs md:text-sm text-zinc-500 max-w-lg mx-auto">
          Objective feedback submitted by registered safety auditors and verified operators.
          Zero fabricated ratings or promotional endorsements.
        </p>
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Testimonial Card - Visora Style */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#f8f8fa] border border-zinc-200/90 shadow-lg relative">
          <div className="absolute top-8 right-8 text-zinc-300">
            <Quote className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
              {activeReview.reviewerName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-900">{activeReview.reviewerName}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Auditor
                </span>
              </div>
              <div className="text-xs text-zinc-500 font-medium">
                Reviewed Product: <strong className="text-zinc-800">{activeReview.productName}</strong>
              </div>
            </div>
          </div>

          {/* Star Ratings */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= activeReview.rating ? "text-amber-500 fill-amber-500" : "text-zinc-300"
                }`}
              />
            ))}
            <span className="text-xs font-bold text-zinc-700 ml-2">
              {activeReview.rating}.0 / 5.0
            </span>
          </div>

          <h3 className="text-base font-bold text-zinc-900 mb-2">
            &ldquo;{activeReview.title}&rdquo;
          </h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            {activeReview.content}
          </p>

          {activeReview.pros && (
            <div className="mt-6 pt-6 border-t border-zinc-200/70 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="text-emerald-700 block mb-0.5">Pros:</strong>
                <span className="text-zinc-600">{activeReview.pros}</span>
              </div>
              <div>
                <strong className="text-amber-700 block mb-0.5">Needs Attention:</strong>
                <span className="text-zinc-600">{activeReview.cons || "Pending verification"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Carousel Controls ( < ) ( > ) */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center hover:bg-zinc-100 transition-colors shadow-xs"
            aria-label="Previous review"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-400">
            {currentIndex + 1} / {reviews.length || 1}
          </span>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-xs"
            aria-label="Next review"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
