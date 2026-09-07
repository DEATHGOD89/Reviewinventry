"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllReviewsForModeration, submitNewReview, ReviewItem } from "@/lib/services/reviews";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { ProductItem } from "@/lib/catalog-data";
import { AuditorBadge } from "@/components/ui/VerificationBadge";
import {
  Star,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  Plus,
  X,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filterType, setFilterType] = useState<"all" | "auditor" | "top">("all");

  // Review Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewerRole, setReviewerRole] = useState("Certified Safety Officer");
  const [auditorRegistrationNumber, setAuditorRegistrationNumber] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const all = getAllReviewsForModeration().filter((r) => r.status === "APPROVED");
    setReviews(all);
    const prods = getAllDynamicProducts();
    setProducts(prods);
    if (prods.length > 0) {
      setSelectedProductId(prods[0].id);
    }
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (filterType === "auditor") return r.isAuditorVerified;
    if (filterType === "top") return r.rating >= 4;
    return true;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === selectedProductId) || products[0];
    if (!product) return;

    try {
      const res = await submitNewReview({
        productId: product.id,
        productName: product.name,
        reviewerName: reviewerName || "Verified Field Auditor",
        reviewerEmail: reviewerEmail || "auditor@verispec.local",
        reviewerRole: reviewerRole || undefined,
        auditorRegistrationNumber: auditorRegistrationNumber || undefined,
        rating,
        title,
        content,
        pros: pros || undefined,
        cons: cons || undefined,
      });

      setSuccessMsg(res.message);
      setTimeout(() => {
        setModalOpen(false);
        setSuccessMsg("");
        setTitle("");
        setContent("");
        setPros("");
        setCons("");
      }, 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="pt-28 pb-24 px-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-zinc-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
            <span>Moderated Field Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950">
            Auditor & Community Reviews
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1 max-w-xl leading-relaxed">
            Read verified field feedback submitted by certified safety officers, facility managers, and registered reviewers.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold shadow-md hover:bg-zinc-800 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Field Review</span>
        </button>
      </div>

      {/* Strict Anti-Fabrication Guidelines Banner */}
      <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 mb-8 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-zinc-900">Strict Moderation Policy:</strong>
          <span className="ml-1">
            We never publish paid testimonials, fabricated expert quotes, or unverified buyer badges.
            All submitted reviews undergo human moderation and cryptographically logged verification before public listing.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterType === "all"
              ? "bg-zinc-900 text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          All Reviews ({reviews.length})
        </button>

        <button
          onClick={() => setFilterType("auditor")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterType === "auditor"
              ? "bg-zinc-900 text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Certified Auditors Only ({reviews.filter((r) => r.isAuditorVerified).length})
        </button>

        <button
          onClick={() => setFilterType("top")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterType === "top"
              ? "bg-zinc-900 text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Rating 4.0+ Stars ({reviews.filter((r) => r.rating >= 4).length})
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-zinc-50 border border-zinc-200 text-zinc-500 text-xs">
            No reviews match the selected criteria.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4 hover:border-zinc-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-zinc-900">{rev.reviewerName}</span>
                    {rev.isAuditorVerified ? (
                      <AuditorBadge role={rev.reviewerRole} registrationNumber={rev.auditorRegistrationNumber} />
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                        Verified Field Report
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Product:{" "}
                    <Link
                      href={`/products/${products.find((p) => p.name === rev.productName || p.id === rev.productId)?.slug || ""}`}
                      className="text-zinc-800 font-bold hover:underline"
                    >
                      {rev.productName}
                    </Link>{" "}
                    &bull; Context: {rev.useCase || "Industrial Plant Facility"}
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

              {(rev.pros || rev.cons) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
                  {rev.pros && (
                    <div>
                      <strong className="text-emerald-700 block mb-0.5">Verified Pros:</strong>
                      <span className="text-zinc-600">{rev.pros}</span>
                    </div>
                  )}
                  {rev.cons && (
                    <div>
                      <strong className="text-amber-700 block mb-0.5">Observations / Limitations:</strong>
                      <span className="text-zinc-600">{rev.cons}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submit Field Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-zinc-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-bold text-zinc-950">
                  Submit Field Safety & Spec Review
                </h3>
                <p className="text-xs text-zinc-500">
                  Auditor reports are queued for staff moderation before listing.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Submission Queued!</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs pt-4">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">
                    Select Target Product *
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs bg-white"
                    required
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">
                      Auditor / Reviewer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Elena Rostova, PE"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={reviewerEmail}
                      onChange={(e) => setReviewerEmail(e.target.value)}
                      placeholder="e.g. auditor@plant.com"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">
                      Professional Role / Credential
                    </label>
                    <input
                      type="text"
                      value={reviewerRole}
                      onChange={(e) => setReviewerRole(e.target.value)}
                      placeholder="e.g. Certified Safety Auditor"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">
                      Registration / Lic. Number
                    </label>
                    <input
                      type="text"
                      value={auditorRegistrationNumber}
                      onChange={(e) => setAuditorRegistrationNumber(e.target.value)}
                      placeholder="e.g. CSP-84920"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= rating ? "fill-amber-500 text-amber-500" : "text-zinc-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-zinc-500 ml-2 font-mono">{rating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">
                    Review Summary Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. High barrier integrity in Class 8 chemical containment"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">
                    Detailed Field Assessment *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe laboratory or shop-floor observations, ergonomics, durability, and standard compliance..."
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Pros</label>
                    <input
                      type="text"
                      value={pros}
                      onChange={(e) => setPros(e.target.value)}
                      placeholder="e.g. Resistant to splash, high tactile grip"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Cons / Notes</label>
                    <input
                      type="text"
                      value={cons}
                      onChange={(e) => setCons(e.target.value)}
                      placeholder="e.g. Heavy packaging, bulk storage needed"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-zinc-950 text-white font-bold hover:bg-zinc-850 transition-colors shadow-xs"
                  >
                    Submit for Moderation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
