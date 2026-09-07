import React from "react";
import Link from "next/link";
import { getAllReviewsForModeration } from "@/lib/services/reviews";
import { AuditorBadge } from "@/components/ui/VerificationBadge";
import { Star, ShieldCheck, MessageSquare, AlertCircle } from "lucide-react";

export default function ReviewsPage() {
  const approvedReviews = getAllReviewsForModeration().filter((r) => r.status === "APPROVED");

  return (
    <div className="pt-28 pb-24 px-6 max-w-5xl mx-auto">
      <div className="mb-10 pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
          <span>Moderated Auditor Registry</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
          Auditor & Community Reviews
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1 max-w-xl leading-relaxed">
          Read verified field feedback submitted by certified safety officers, facility managers, and registered reviewers.
        </p>
      </div>

      {/* Guidelines Banner */}
      <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 mb-8 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-zinc-900">Strict Moderation Policy:</strong>
          <span className="ml-1">
            We never publish paid testimonials, fabricated expert quotes, or unverified buyer badges.
            All submitted reviews undergo human moderation prior to public listing.
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {approvedReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-zinc-900">{rev.reviewerName}</span>
                  {rev.isAuditorVerified ? (
                    <AuditorBadge role={rev.reviewerRole} registrationNumber={rev.auditorRegistrationNumber} />
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      Verified Community Review
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  Product: <strong className="text-zinc-700">{rev.productName}</strong> &bull; Context: {rev.useCase}
                </div>
              </div>

              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= rev.rating ? "fill-amber-500 text-amber-500" : "text-zinc-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="text-base font-bold text-zinc-900">&ldquo;{rev.title}&rdquo;</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">{rev.content}</p>

            {rev.pros && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
                <div>
                  <strong className="text-emerald-700 block mb-0.5">Pros:</strong>
                  <span className="text-zinc-600">{rev.pros}</span>
                </div>
                <div>
                  <strong className="text-amber-700 block mb-0.5">Cons / Observations:</strong>
                  <span className="text-zinc-600">{rev.cons}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
