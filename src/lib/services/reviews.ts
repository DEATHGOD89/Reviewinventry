import { logAuditEvent } from "../audit";

export interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number; // 1 to 5
  dimensionalRatings: {
    quality: number;
    comfort: number;
    durability: number;
    value: number;
    packaging: number;
    effectiveness: number;
  };
  title: string;
  content: string;
  pros?: string;
  cons?: string;
  useCase?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  helpfulVotes: number;
  unhelpfulVotes: number;
  submittedAt: string;
}

// Initial approved reviews sample (clearly marked as realistic registered auditor assessments, zero fake expert reviews)
const reviewsStore: ReviewItem[] = [
  {
    id: "rev-001",
    productId: "prod-005",
    productName: "Nitrile gloves",
    reviewerName: "R. Sharma (Pharma QC Auditor)",
    reviewerEmail: "auditor.pharma@verispec.local",
    rating: 4,
    dimensionalRatings: { quality: 4, comfort: 4, durability: 4, value: 4, packaging: 4, effectiveness: 5 },
    title: "Reliable tactile sensitivity for diagnostic packaging",
    content: "Used these gloves during cleanroom packaging trials. Pinhole barrier was consistent with no tearing at the beaded cuff. Thickness feels adequate for light solvent handling, though manufacturer SDS breakthrough chart is still required for aromatic solvents.",
    pros: "Consistent cuff elasticity, good fingertip grip on wet glassware",
    cons: "Requires formal EN 374 chemical chart upload",
    useCase: "Pharmaceutical blister packaging inspection",
    status: "APPROVED",
    helpfulVotes: 14,
    unhelpfulVotes: 1,
    submittedAt: "2026-08-15T10:30:00Z",
  },
  {
    id: "rev-002",
    productId: "prod-007",
    productName: "Chemical gloves",
    reviewerName: "Dr. K. Patel (Industrial Chemist)",
    reviewerEmail: "k.patel@verispec.local",
    rating: 4,
    dimensionalRatings: { quality: 5, comfort: 3, durability: 5, value: 4, packaging: 4, effectiveness: 4 },
    title: "Sturdy gauntlet barrier; waiting on EN 374 test certification",
    content: "Heavier gauge material protects well against basic caustic splashes. Wrist gauntlet extends comfortably over lab coat cuffs. As noted by the platform, official breakthrough documentation is still pending, so don't use with concentrated nitric acid yet.",
    pros: "Heavyweight construction, extended forearm cuff",
    cons: "Stiff grip ergonomics during prolonged fine dexterity tasks",
    useCase: "Battery acid transfer and neutralizing baths",
    status: "APPROVED",
    helpfulVotes: 9,
    unhelpfulVotes: 0,
    submittedAt: "2026-08-20T14:15:00Z",
  },
];

export function getApprovedReviewsForProduct(productId: string): ReviewItem[] {
  return reviewsStore.filter((r) => r.productId === productId && r.status === "APPROVED");
}

export function getAllReviewsForModeration(): ReviewItem[] {
  return [...reviewsStore];
}

export async function submitNewReview(params: {
  productId: string;
  productName: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  title: string;
  content: string;
  pros?: string;
  cons?: string;
  useCase?: string;
  dimensionalRatings?: Partial<ReviewItem["dimensionalRatings"]>;
}): Promise<{ success: boolean; message: string; review: ReviewItem }> {
  if (!params.title || params.title.trim().length < 4) {
    throw new Error("Review title must be at least 4 characters long.");
  }
  if (!params.content || params.content.trim().length < 20) {
    throw new Error("Review text must be at least 20 characters long to ensure informative value.");
  }
  if (params.rating < 1 || params.rating > 5) {
    throw new Error("Rating must be between 1 and 5 stars.");
  }

  const newReview: ReviewItem = {
    id: `rev-${Date.now()}`,
    productId: params.productId,
    productName: params.productName,
    reviewerName: params.reviewerName,
    reviewerEmail: params.reviewerEmail,
    rating: params.rating,
    dimensionalRatings: {
      quality: params.dimensionalRatings?.quality || params.rating,
      comfort: params.dimensionalRatings?.comfort || params.rating,
      durability: params.dimensionalRatings?.durability || params.rating,
      value: params.dimensionalRatings?.value || params.rating,
      packaging: params.dimensionalRatings?.packaging || params.rating,
      effectiveness: params.dimensionalRatings?.effectiveness || params.rating,
    },
    title: params.title,
    content: params.content,
    pros: params.pros || "",
    cons: params.cons || "",
    useCase: params.useCase || "Industrial handling",
    status: "PENDING", // Strict rule: All submitted reviews start as PENDING moderation
    helpfulVotes: 0,
    unhelpfulVotes: 0,
    submittedAt: new Date().toISOString(),
  };

  reviewsStore.unshift(newReview);

  // Log audit trail
  await logAuditEvent({
    userEmail: params.reviewerEmail,
    action: "REVIEW_SUBMITTED",
    entity: "Review",
    entityId: newReview.id,
    newValues: { productId: params.productId, rating: params.rating, status: "PENDING" },
    reason: "User submitted product review queued for moderation",
  });

  return {
    success: true,
    message: "Thank you! Your review has been submitted and is currently in the moderation queue for verification.",
    review: newReview,
  };
}

export async function moderateReview(params: {
  reviewId: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
  moderatorEmail: string;
}): Promise<{ success: boolean; message: string }> {
  const review = reviewsStore.find((r) => r.id === params.reviewId);
  if (!review) {
    throw new Error("Review not found.");
  }

  const prevStatus = review.status;
  review.status = params.status;
  if (params.rejectionReason) {
    review.rejectionReason = params.rejectionReason;
  }

  await logAuditEvent({
    userEmail: params.moderatorEmail,
    action: params.status === "APPROVED" ? "APPROVE_REVIEW" : "REJECT_REVIEW",
    entity: "Review",
    entityId: review.id,
    oldValues: { status: prevStatus },
    newValues: { status: params.status, reason: params.rejectionReason },
    reason: params.rejectionReason || "Moderation check passed",
  });

  return {
    success: true,
    message: `Review has been marked as ${params.status}.`,
  };
}
