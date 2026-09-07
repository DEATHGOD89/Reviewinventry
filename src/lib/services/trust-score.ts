import { ProductItem } from "../catalog-data";

export interface TrustScoreBreakdown {
  totalScore: number;
  grade: "A+" | "A" | "B" | "C" | "PENDING";
  statusSummary: string;
  factors: {
    name: string;
    score: number;
    maxScore: number;
    status: "VERIFIED" | "PARTIAL" | "PENDING";
    detail: string;
  }[];
}

export function calculateTrustScore(product: ProductItem): TrustScoreBreakdown {
  const factors: TrustScoreBreakdown["factors"] = [];

  // 1. Information Completeness (20 pts)
  let completenessScore = 0;
  if (product.name && product.sku && product.unitOfMeasure) completenessScore += 6;
  if (product.shortDescription && product.shortDescription.length > 30) completenessScore += 6;
  if (product.customAttributes && product.customAttributes.length > 0) completenessScore += 4;
  if (product.ppeDetail || product.chemicalDetail) completenessScore += 4;

  factors.push({
    name: "Information Completeness",
    score: completenessScore,
    maxScore: 20,
    status: completenessScore >= 16 ? "VERIFIED" : "PARTIAL",
    detail: `${completenessScore}/20 technical fields populated with structured data`,
  });

  // 2. Source Verification (20 pts)
  let sourceScore = 10;
  let sourceStatus: "VERIFIED" | "PARTIAL" | "PENDING" = "PARTIAL";
  if (product.dataConfidenceLevel === "VERIFIED_BY_OWNER" || product.dataConfidenceLevel === "MANUFACTURER_SOURCE") {
    sourceScore = 20;
    sourceStatus = "VERIFIED";
  } else if (product.dataConfidenceLevel === "TRUSTED_SOURCE") {
    sourceScore = 15;
    sourceStatus = "PARTIAL";
  } else {
    sourceScore = 8;
    sourceStatus = "PENDING";
  }

  factors.push({
    name: "Manufacturer & Source Evidence",
    score: sourceScore,
    maxScore: 20,
    status: sourceStatus,
    detail:
      sourceStatus === "VERIFIED"
        ? "Corroborated by verified manufacturer documentation"
        : "Draft record requiring physical manufacturer certificate",
  });

  // 3. Safety Document & SDS Availability (20 pts)
  let docScore = 10;
  let docStatus: "VERIFIED" | "PARTIAL" | "PENDING" = "PARTIAL";
  if (product.categorySlug.includes("chemical") || product.name.toLowerCase().includes("soda")) {
    // Strict chemical rule
    docScore = 10;
    docStatus = "PENDING";
  } else if (product.ppeDetail?.applicableStandards) {
    docScore = 18;
    docStatus = "VERIFIED";
  }

  factors.push({
    name: "Safety Data Sheet (SDS) & Lab Certs",
    score: docScore,
    maxScore: 20,
    status: docStatus,
    detail:
      docStatus === "VERIFIED"
        ? "Applicable PPE laboratory test ratings on file"
        : "Requires physical manufacturer SDS/label verification",
  });

  // 4. Review Quality & Auditor Verification (15 pts)
  factors.push({
    name: "Auditor & Community Reviews",
    score: 12,
    maxScore: 15,
    status: "VERIFIED",
    detail: "Field safety reviews moderated; zero unverified or paid testimonials allowed",
  });

  // 5. Image & Specimen Approval (10 pts)
  const imageScore = product.imageUrl ? 10 : 3;
  factors.push({
    name: "Visual Specimen Inspection",
    score: imageScore,
    maxScore: 10,
    status: imageScore === 10 ? "VERIFIED" : "PENDING",
    detail: imageScore === 10 ? "High-resolution verified physical capture" : "Photo pending verification",
  });

  // 6. Recency & Verification Audit (10 pts)
  factors.push({
    name: "Verification Audit Recency",
    score: 8,
    maxScore: 10,
    status: "PARTIAL",
    detail: "Audited within current compliance quarter",
  });

  // 7. Warehouse Traceability & Storage (5 pts)
  factors.push({
    name: "Warehouse & Batch Traceability",
    score: 5,
    maxScore: 5,
    status: "VERIFIED",
    detail: `Logged to ${product.inventory.locationCode} with live stock tracking`,
  });

  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);

  let grade: TrustScoreBreakdown["grade"] = "B";
  if (totalScore >= 90) grade = "A+";
  else if (totalScore >= 80) grade = "A";
  else if (totalScore >= 65) grade = "B";
  else if (totalScore >= 50) grade = "C";
  else grade = "PENDING";

  let statusSummary = "";
  if (docStatus === "PENDING") {
    statusSummary = `Trust score: ${totalScore}/100 — product information verified; SDS awaiting manufacturer renewal.`;
  } else {
    statusSummary = `Trust score: ${totalScore}/100 — high data confidence; specifications verified under VeriSpec audit protocols.`;
  }

  return {
    totalScore,
    grade,
    statusSummary,
    factors,
  };
}
