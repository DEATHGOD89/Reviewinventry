import { INITIAL_19_PRODUCTS } from "../catalog-data";
import { EXTRA_DEMO_PRODUCTS } from "./products-crud";

export type AnalyticsPeriod = "DAY" | "MONTH" | "YEAR" | "LIVE";

export interface ProductFeedbackStats {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  views: number;
  likes: number;
  dislikes: number;
  approvalRatio: number; // percentage e.g. 92%
  externalBuyClicks: number;
  searchImpressions: number;
}

export interface TimeSeriesDataPoint {
  label: string; // e.g., "09:00", "Sep 07", "Q3", "2026"
  views: number;
  likes: number;
  dislikes: number;
  externalClicks: number;
}

export interface AnalyticsReport {
  period: AnalyticsPeriod;
  selectedDate: string; // YYYY-MM-DD or YYYY-MM or YYYY
  totalVisitors: number;
  totalViews: number;
  totalLikes: number;
  totalDislikes: number;
  totalExternalClicks: number;
  topLikedProducts: ProductFeedbackStats[];
  topDislikedProducts: ProductFeedbackStats[];
  allProductStats: ProductFeedbackStats[];
  timeSeries: TimeSeriesDataPoint[];
  topSearchKeywords: Array<{ keyword: string; count: number }>;
}

const allProducts = [...INITIAL_19_PRODUCTS, ...EXTRA_DEMO_PRODUCTS];

// Generate consistent, realistic metrics seeded by date
export function generateAnalyticsReport(
  period: AnalyticsPeriod,
  selectedDateString: string = "2026-09-07"
): AnalyticsReport {
  // Use a pseudo-random multiplier based on date string
  let seed = 0;
  for (let i = 0; i < selectedDateString.length; i++) {
    seed += selectedDateString.charCodeAt(i);
  }

  const multiplier = period === "YEAR" ? 365 : period === "MONTH" ? 30 : 1;

  const productStats: ProductFeedbackStats[] = allProducts.map((p, idx) => {
    const baseViews = (120 + ((seed * (idx + 3)) % 380)) * (period === "YEAR" ? 45 : period === "MONTH" ? 8 : 1);
    const likes = Math.round(baseViews * (0.65 + ((idx % 4) * 0.08)));
    const dislikes = Math.round(baseViews * (0.04 + ((idx % 3) * 0.03)));
    const totalVotes = likes + dislikes;
    const approvalRatio = totalVotes > 0 ? Math.round((likes / totalVotes) * 100) : 0;
    const externalBuyClicks = Math.round(baseViews * 0.22);
    const searchImpressions = Math.round(baseViews * 1.8);

    return {
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      category: p.categoryName,
      views: baseViews,
      likes,
      dislikes,
      approvalRatio,
      externalBuyClicks,
      searchImpressions,
    };
  });

  // Sort by likes descending
  const topLiked = [...productStats].sort((a, b) => b.likes - a.likes).slice(0, 5);
  // Sort by dislikes descending
  const topDisliked = [...productStats].sort((a, b) => b.dislikes - a.dislikes).slice(0, 5);

  // Time series generation
  const timeSeries: TimeSeriesDataPoint[] = [];

  if (period === "DAY" || period === "LIVE") {
    const hours = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
    hours.forEach((hr, i) => {
      const v = 40 + ((seed * (i + 2)) % 90);
      timeSeries.push({
        label: hr,
        views: v,
        likes: Math.round(v * 0.7),
        dislikes: Math.round(v * 0.05),
        externalClicks: Math.round(v * 0.2),
      });
    });
  } else if (period === "MONTH") {
    // 4 weeks
    ["Week 1", "Week 2", "Week 3", "Week 4"].forEach((wk, i) => {
      const v = (520 + ((seed * (i + 1)) % 350));
      timeSeries.push({
        label: wk,
        views: v,
        likes: Math.round(v * 0.72),
        dislikes: Math.round(v * 0.06),
        externalClicks: Math.round(v * 0.24),
      });
    });
  } else {
    // 12 months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach((m, i) => {
      const v = (1800 + ((seed * (i + 5)) % 950));
      timeSeries.push({
        label: m,
        views: v,
        likes: Math.round(v * 0.74),
        dislikes: Math.round(v * 0.05),
        externalClicks: Math.round(v * 0.26),
      });
    });
  }

  const totalViews = productStats.reduce((acc, p) => acc + p.views, 0);
  const totalLikes = productStats.reduce((acc, p) => acc + p.likes, 0);
  const totalDislikes = productStats.reduce((acc, p) => acc + p.dislikes, 0);
  const totalExternalClicks = productStats.reduce((acc, p) => acc + p.externalBuyClicks, 0);
  const totalVisitors = Math.round(totalViews * 0.75);

  const topKeywords = [
    { keyword: "nitrile gloves powder-free", count: Math.round(480 * multiplier) },
    { keyword: "caustic soda SDS 2026", count: Math.round(390 * multiplier) },
    { keyword: "EN 374 chemical barrier", count: Math.round(310 * multiplier) },
    { keyword: "safety shoes steel toe", count: Math.round(270 * multiplier) },
    { keyword: "divo flow cleaner dilution", count: Math.round(190 * multiplier) },
    { keyword: "electrical dielectric gloves", count: Math.round(140 * multiplier) },
  ];

  return {
    period,
    selectedDate: selectedDateString,
    totalVisitors,
    totalViews,
    totalLikes,
    totalDislikes,
    totalExternalClicks,
    topLikedProducts: topLiked,
    topDislikedProducts: topDisliked,
    allProductStats: productStats,
    timeSeries,
    topSearchKeywords: topKeywords,
  };
}

// Convert report to downloadable CSV string
export function exportReportToCsv(report: AnalyticsReport): string {
  const headers = [
    "Product SKU",
    "Product Name",
    "Category",
    "Total Views",
    "Likes (Positive)",
    "Dislikes (Negative)",
    "Approval Ratio (%)",
    "External Buy Clicks",
    "Search Impressions",
  ];

  const rows = report.allProductStats.map((p) => [
    `"${p.sku}"`,
    `"${p.productName}"`,
    `"${p.category}"`,
    p.views,
    p.likes,
    p.dislikes,
    `${p.approvalRatio}%`,
    p.externalBuyClicks,
    p.searchImpressions,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
