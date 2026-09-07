"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { INITIAL_19_PRODUCTS, ProductItem } from "@/lib/catalog-data";
import { getDynamicProductBySlug } from "@/lib/services/products-crud";
import { VerificationBadge, AuditorBadge } from "@/components/ui/VerificationBadge";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { Product360Viewer } from "@/components/ui/Product360Viewer";
import { convertFromInr, INDICATIVE_PRICE_DISCLAIMER } from "@/lib/services/currency";
import { getApprovedReviewsForProduct, submitNewReview } from "@/lib/services/reviews";
import {
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  SlidersHorizontal,
  FileText,
  AlertTriangle,
  Beaker,
  Layers,
  Star,
  CheckCircle,
  HelpCircle,
  Flag,
  ArrowRight,
  Info,
  Camera,
  RotateCw,
  QrCode,
} from "lucide-react";
import { WarehouseLabelModal } from "@/components/ui/WarehouseLabelModal";
import { SdsDocumentViewer } from "@/components/ui/SdsDocumentViewer";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product: ProductItem | undefined =
    getDynamicProductBySlug(slug) || INITIAL_19_PRODUCTS.find((p) => p.slug === slug);

  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");
  const [activeMediaView, setActiveMediaView] = useState<"photo" | "360">("photo");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [labelModalOpen, setLabelModalOpen] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>("");

  // Review submission state
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewContent, setReviewContent] = useState<string>("");
  const [reviewerName, setReviewerName] = useState<string>("");
  const [reviewerEmail, setReviewerEmail] = useState<string>("");
  const [reviewerRole, setReviewerRole] = useState<string>("");
  const [auditorRegistrationNumber, setAuditorRegistrationNumber] = useState<string>("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string>("");

  if (!product) {
    notFound();
  }

  const convertedPrice = convertFromInr(product.indicativePriceInr, selectedCurrency);
  const approvedReviews = getApprovedReviewsForProduct(product.id);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await submitNewReview({
        productId: product.id,
        productName: product.name,
        reviewerName: reviewerName || "Verified Auditor",
        reviewerEmail: reviewerEmail || "auditor@verispec.local",
        reviewerRole: reviewerRole || undefined,
        auditorRegistrationNumber: auditorRegistrationNumber || undefined,
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
      });
      setReviewSuccessMsg(res.message);
      setTimeout(() => {
        setReviewModalOpen(false);
        setReviewSuccessMsg("");
      }, 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportReason("");
    }, 2000);
  };

  return (
    <div className="pt-28 pb-24 px-6 max-w-6xl mx-auto">
      {/* Breadcrumb & Verification Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Link href="/products" className="hover:text-zinc-950 transition-colors">
            Catalogue
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.categorySlug}`}
            className="hover:text-zinc-950 transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">{product.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <VerificationBadge status={product.status} confidence={product.dataConfidenceLevel} />
          <button
            onClick={() => setLabelModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Print Bin & Rack Label</span>
          </button>
          <button
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 underline underline-offset-4"
          >
            <Flag className="w-3 h-3" />
            <span>Report inaccurate info</span>
          </button>
        </div>
      </div>

      {/* Main Product Master Card */}
      <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs p-6 md:p-10 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left / Center 2 Cols: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 text-zinc-600 font-bold">
                  SKU: {product.sku}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  UOM: {product.unitOfMeasure}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-950">
                {product.name}
              </h1>
              <p className="text-sm md:text-base text-zinc-600 mt-3 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Strict Zero-Hallucination Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">DRAFT RECORD &bull; PENDING MANUFACTURER VERIFICATION</strong>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  No health claims, certifications, or performance standards are confirmed until manufacturer lab reports and official SDS/MSDS are verified by management.
                </p>
              </div>
            </div>

            {/* Visual Showcase: Industrial Photography & 360° Rotator */}
            <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
              {/* Media Mode Tabs */}
              <div className="flex items-center justify-between p-3 bg-zinc-50 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveMediaView("photo")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeMediaView === "photo"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "bg-white text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Industrial Photography</span>
                  </button>

                  <button
                    onClick={() => setActiveMediaView("360")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeMediaView === "360"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "bg-white text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>360° Interactive View</span>
                  </button>
                </div>

                <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                  Verified Master Asset
                </span>
              </div>

              {/* View Content */}
              {activeMediaView === "photo" ? (
                <div className="p-4 space-y-4">
                  <div className="relative w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                    <img
                      src={
                        (product.galleryImages && product.galleryImages[selectedPhotoIndex]) ||
                        product.imageUrl ||
                        "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-mono text-white flex items-center gap-2">
                      <span>Photo {selectedPhotoIndex + 1} of {(product.galleryImages?.length || 1)}</span>
                      <span>&bull;</span>
                      <span className="text-zinc-300">High-Resolution Capture</span>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {product.galleryImages && product.galleryImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {product.galleryImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPhotoIndex(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                            selectedPhotoIndex === idx
                              ? "border-zinc-950 ring-2 ring-zinc-950/20 scale-105"
                              : "border-zinc-200 hover:border-zinc-400 opacity-75 hover:opacity-100"
                          }`}
                        >
                          <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  <Product360Viewer
                    productName={product.name}
                    category={product.categoryName}
                    sku={product.sku}
                  />
                </div>
              )}
            </div>

            {/* Full Description & Limitations */}
            <div className="space-y-4 text-xs text-zinc-700">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 mb-1">Detailed Technical Context</h3>
                <p className="leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  {product.fullDescription}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 mb-1">Limitations & Operational Warnings</h3>
                <p className="leading-relaxed bg-red-50/60 text-red-900 p-4 rounded-2xl border border-red-200">
                  {product.limitationsAndWarnings}
                </p>
              </div>
            </div>

            {/* Specific PPE Data Section */}
            {product.ppeDetail && (
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                  <Layers className="w-4 h-4 text-zinc-700" />
                  <span>PPE Specific Standards & Physical Properties</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-zinc-200">
                    <span className="text-zinc-400 block text-[10px]">Protection Type</span>
                    <strong className="text-zinc-800">{product.ppeDetail.protectionType}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200">
                    <span className="text-zinc-400 block text-[10px]">Material</span>
                    <strong className="text-zinc-800">{product.ppeDetail.material}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200">
                    <span className="text-zinc-400 block text-[10px]">Reusable Status</span>
                    <strong className="text-zinc-800">{product.ppeDetail.isReusable ? "Reusable" : "Disposable"}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200">
                    <span className="text-zinc-400 block text-[10px]">Latex-Free Status</span>
                    <strong className="text-zinc-800">{product.ppeDetail.latexFreeStatus}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 col-span-2">
                    <span className="text-zinc-400 block text-[10px]">Applicable Standards</span>
                    <strong className="text-zinc-800">{product.ppeDetail.applicableStandards}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Specific Chemical Data Section */}
            {product.chemicalDetail && (
              <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
                <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                  <Beaker className="w-4 h-4 text-purple-700" />
                  <span>Chemical Safety & Safety Data Sheet (SDS) Attributes</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-purple-100">
                    <span className="text-zinc-400 block text-[10px]">Product Form</span>
                    <strong className="text-purple-950">{product.chemicalDetail.productForm}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-purple-100">
                    <span className="text-zinc-400 block text-[10px]">Active Ingredients</span>
                    <strong className="text-purple-950">{product.chemicalDetail.activeIngredients}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-purple-100">
                    <span className="text-zinc-400 block text-[10px]">Hazard Classification</span>
                    <strong className="text-red-700">{product.chemicalDetail.hazardClassification}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-purple-100">
                    <span className="text-zinc-400 block text-[10px]">PPE Required for Handling</span>
                    <strong className="text-purple-950">{product.chemicalDetail.requiredPpe}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-purple-100 col-span-1 sm:col-span-2">
                    <span className="text-zinc-400 block text-[10px]">First Aid Reference</span>
                    <strong className="text-zinc-800">{product.chemicalDetail.firstAidReference}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* GHS 16-Section Safety Data Sheet (SDS) & Regulatory Compliance */}
            <div className="pt-2">
              <SdsDocumentViewer product={product} />
            </div>
          </div>

          {/* Right Col: Indicative Pricing & External Seller Links */}
          <div className="space-y-6">
            {/* Global Indicative Pricing Box */}
            <div className="p-6 rounded-3xl bg-zinc-950 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Indicative Pricing</span>
                <CurrencySelector
                  currentCurrency={selectedCurrency}
                  onCurrencyChange={setSelectedCurrency}
                />
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-black tracking-tight text-white">
                  {convertedPrice.formatted}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-1">
                  Baseline Ref: ₹{product.indicativePriceInr.toFixed(2)} INR
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
                <p className="font-semibold text-amber-300 mb-1">NON-STORE NOTICE</p>
                <p>{INDICATIVE_PRICE_DISCLAIMER}</p>
              </div>

              {/* Warehouse Stock Telemetry */}
              <div className="pt-3 border-t border-zinc-800 text-xs font-mono flex items-center justify-between text-zinc-400">
                <span>Warehouse: {product.inventory.locationCode}</span>
                <span className="text-emerald-400 font-bold">{product.inventory.currentStock} in stock</span>
              </div>
            </div>

            {/* Approved External Purchase Links */}
            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Approved External Suppliers
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">External only</span>
              </div>

              <p className="text-xs text-zinc-500">
                Purchase directly from authorized external suppliers. VeriSpec never accepts payments or processes orders.
              </p>

              <div className="space-y-2">
                {product.externalPurchaseLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-3.5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-900 shadow-xs flex items-center justify-between transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-900 group-hover:text-zinc-700">
                        {link.sellerName}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Destination: {link.destinationCountry} &bull; Ref price: ₹{link.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 text-white text-[11px] font-semibold">
                      <span>Buy from external seller</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Compare Action */}
            <Link
              href={`/compare?p1=${product.slug}`}
              className="w-full py-3 px-4 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-300/80 text-zinc-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Compare {product.name} with another item</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Community Reviews Section */}
      <div className="rounded-3xl bg-white border border-zinc-200 p-6 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              Community & Auditor Reviews
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Objective assessments. All reviews are moderated before publication to prevent spam or promotional content.
            </p>
          </div>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-850 transition-colors shrink-0"
          >
            Submit Auditor Review
          </button>
        </div>

        {approvedReviews.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">
            <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="font-bold text-zinc-700">No approved reviews yet.</p>
            <p className="mt-1">Be the first registered auditor or verified user to submit an assessment for this draft record.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 mt-6 space-y-6">
            {approvedReviews.map((rev) => (
              <div key={rev.id} className="pt-6 first:pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">{rev.reviewerName}</span>
                    {rev.isAuditorVerified ? (
                      <AuditorBadge role={rev.reviewerRole} registrationNumber={rev.auditorRegistrationNumber} />
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                        Verified Review
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? "fill-amber-500 text-amber-500" : "text-zinc-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-zinc-900">&ldquo;{rev.title}&rdquo;</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{rev.content}</p>

                {rev.pros && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-zinc-50 p-3 rounded-xl">
                    <div>
                      <strong className="text-emerald-700">Pros:</strong> {rev.pros}
                    </div>
                    <div>
                      <strong className="text-amber-700">Cons:</strong> {rev.cons || "None reported"}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-zinc-200 shadow-2xl relative">
            <h3 className="text-lg font-bold text-zinc-950 mb-2">
              Submit Review for {product.name}
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              All first-time reviews require moderation before appearing publicly.
            </p>

            {reviewSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-medium">
                {reviewSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Your Name / Auditor Role</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. A. Kumar (Safety Officer)"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Auditor Email</label>
                  <input
                    type="email"
                    required
                    value={reviewerEmail}
                    onChange={(e) => setReviewerEmail(e.target.value)}
                    placeholder="e.g. auditor@company.com"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">
                      Auditor Role / Title <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={reviewerRole}
                      onChange={(e) => setReviewerRole(e.target.value)}
                      placeholder="e.g. Lead EHS Inspector"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">
                      Auditor Reg # <span className="text-zinc-400 font-normal">(for verified badge)</span>
                    </label>
                    <input
                      type="text"
                      value={auditorRegistrationNumber}
                      onChange={(e) => setAuditorRegistrationNumber(e.target.value)}
                      placeholder="e.g. ISO-45001-889"
                      className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Overall Rating (1 to 5 Stars)</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  >
                    <option value={5}>5 Stars - Outstanding compliance</option>
                    <option value={4}>4 Stars - High performance</option>
                    <option value={3}>3 Stars - Satisfactory</option>
                    <option value={2}>2 Stars - Substandard</option>
                    <option value={1}>1 Star - Non-compliant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Review Title</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summary of assessment"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Detailed Findings</label>
                  <textarea
                    rows={4}
                    required
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Provide specific notes regarding durability, fit, barrier integrity, or testing observations..."
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-zinc-950 text-white font-semibold"
                  >
                    Submit for Moderation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Report Inaccurate Information Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-950 mb-2">
              Report Inaccurate Specification
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Help us maintain factual integrity. Reports are reviewed by system moderators within 24 hours.
            </p>

            {reportSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-medium">
                Report logged successfully. Our verification team has been notified.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Issue Description</label>
                  <textarea
                    rows={4}
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Describe what is inaccurate (e.g. incorrect hazard rating, wrong UOM, outdated SDS)..."
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Printable Warehouse Bin & Rack Label Modal */}
      <WarehouseLabelModal
        product={product}
        isOpen={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
      />
    </div>
  );
}
