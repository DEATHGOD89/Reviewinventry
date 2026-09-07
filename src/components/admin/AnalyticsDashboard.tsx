"use client";

import React, { useState, useMemo } from "react";
import {
  generateAnalyticsReport,
  exportReportToCsv,
  AnalyticsPeriod,
  AnalyticsReport,
} from "@/lib/services/analytics";
import {
  BarChart3,
  Calendar,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Download,
  Eye,
  ExternalLink,
  Search,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

export const AnalyticsDashboard: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>("DAY");
  const [selectedDate, setSelectedDate] = useState("2026-09-07");
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [isLiveActive, setIsLiveActive] = useState(false);

  const activeDateParam = useMemo(() => {
    if (period === "DAY" || period === "LIVE") return selectedDate;
    if (period === "MONTH") return selectedMonth;
    return selectedYear;
  }, [period, selectedDate, selectedMonth, selectedYear]);

  const report: AnalyticsReport = useMemo(() => {
    return generateAnalyticsReport(period, activeDateParam);
  }, [period, activeDateParam]);

  const handleDownloadCsv = () => {
    const csvContent = exportReportToCsv(report);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `verispec-analytics-${period.toLowerCase()}-${activeDateParam}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find max views for chart scaling
  const maxSeriesViews = Math.max(...report.timeSeries.map((d) => d.views), 10);
  const maxProductLikes = Math.max(...report.allProductStats.map((p) => p.likes), 10);

  return (
    <div className="space-y-8">
      {/* Control Banner: Period & Date Pickers */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Intelligence Telemetry
            </span>
            {period === "LIVE" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> LIVE STREAM
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-zinc-950">
            User Engagement & Product Feedback Reports
          </h2>
        </div>

        {/* Filters & Export Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Period Toggle Pills */}
          <div className="flex items-center p-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold">
            {(["DAY", "MONTH", "YEAR", "LIVE"] as AnalyticsPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  period === p
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                {p === "DAY" ? "Daily" : p === "MONTH" ? "Monthly" : p === "YEAR" ? "Yearly" : "Live"}
              </button>
            ))}
          </div>

          {/* Dynamic Date Input depending on mode */}
          {period === "DAY" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs px-3 py-2 rounded-full border border-zinc-200 bg-zinc-50 font-mono"
            />
          )}

          {period === "MONTH" && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs px-3 py-2 rounded-full border border-zinc-200 bg-zinc-50 font-mono"
            />
          )}

          {period === "YEAR" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-xs px-3 py-2 rounded-full border border-zinc-200 bg-zinc-50 font-mono"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          )}

          {/* Export to CSV/Excel */}
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Active Visitors</div>
          <div className="text-3xl font-black text-zinc-950 mt-1">
            {report.totalVisitors.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">&uarr; +14% vs previous {period.toLowerCase()}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-bold text-zinc-400 uppercase">Product Views</div>
          <div className="text-3xl font-black text-zinc-950 mt-1">
            {report.totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Avg 2.4 views/visitor</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>Total Positive (Likes)</span>
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-1">
            {report.totalLikes.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
            {Math.round((report.totalLikes / (report.totalLikes + report.totalDislikes || 1)) * 100)}% positive ratio
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1">
            <ThumbsDown className="w-3 h-3" />
            <span>Negative (Dislikes)</span>
          </div>
          <div className="text-3xl font-black text-red-600 mt-1">
            {report.totalDislikes.toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Flagged for QC review</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Time-Series Activity Trend */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-950">Traffic & Engagement Volume</h3>
              <p className="text-xs text-zinc-400">
                Timeline breakdown for {period === "DAY" ? selectedDate : period === "MONTH" ? selectedMonth : selectedYear}
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">Scale: Max {maxSeriesViews}</span>
          </div>

          {/* Visual SVG Trend Graph */}
          <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 border-b border-zinc-100">
            {report.timeSeries.map((d, i) => {
              const heightPct = Math.max(15, Math.round((d.views / maxSeriesViews) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg pointer-events-none transition-opacity whitespace-nowrap z-20">
                    Views: {d.views} &bull; Likes: {d.likes}
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full max-w-[32px] rounded-t-lg bg-zinc-900 group-hover:bg-cyan-600 transition-colors"
                    style={{ height: `${heightPct}%` }}
                  />
                  {/* Label */}
                  <span className="text-[10px] text-zinc-400 font-mono">{d.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-500 font-mono pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900" />
              Unique Views
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600" />
              Positive Engagement
            </span>
          </div>
        </div>

        {/* Right Col: Top Search Inquiries */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-950">Top Search Queries</h3>
            <Search className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-xs text-zinc-400">Most frequent user product search inquiries</p>

          <div className="space-y-2.5 pt-2">
            {report.topSearchKeywords.map((k, idx) => (
              <div
                key={k.keyword}
                className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 font-medium text-zinc-800">
                  <span className="text-zinc-400 font-mono text-[10px]">#{idx + 1}</span>
                  <span>{k.keyword}</span>
                </div>
                <span className="font-mono font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-md border border-zinc-200 text-[11px]">
                  {k.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Like vs Dislike Breakdown Graph & Table */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-zinc-950">Product Approval Spectrum (Likes vs Dislikes)</h3>
            <p className="text-xs text-zinc-400">
              Comparative sentiment analysis across all master and demo catalogue items
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">{report.allProductStats.length} monitored items</span>
        </div>

        {/* Comparative Likes / Dislikes Horizontal Bars */}
        <div className="space-y-3">
          {report.allProductStats.slice(0, 8).map((p) => {
            const likePct = p.approvalRatio;
            const dislikePct = 100 - p.approvalRatio;

            return (
              <div key={p.productId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900">{p.productName}</span>
                    <span className="text-zinc-400 font-mono text-[10px]">({p.sku})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="text-emerald-700 font-bold">&uarr; {p.likes} likes</span>
                    <span className="text-red-600">&darr; {p.dislikes} dislikes</span>
                    <span className="text-zinc-950 font-bold px-1.5 py-0.5 rounded bg-zinc-100">
                      {p.approvalRatio}%
                    </span>
                  </div>
                </div>

                {/* Ratio Bar */}
                <div className="h-2 w-full rounded-full bg-zinc-100 flex overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${likePct}%` }} />
                  <div className="bg-red-400 h-full" style={{ width: `${dislikePct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Complete Report Sheet Table */}
        <div className="pt-4 border-t border-zinc-200 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-200 font-bold text-zinc-600 bg-zinc-50/50">
                <th className="p-3">SKU</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Views</th>
                <th className="p-3 text-emerald-700">Likes</th>
                <th className="p-3 text-red-600">Dislikes</th>
                <th className="p-3">Approval Ratio</th>
                <th className="p-3">Buy Clicks (Ext)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono">
              {report.allProductStats.map((p) => (
                <tr key={p.productId} className="hover:bg-zinc-50/80">
                  <td className="p-3 font-bold text-zinc-700">{p.sku}</td>
                  <td className="p-3 font-sans font-bold text-zinc-950">{p.productName}</td>
                  <td className="p-3 font-sans text-zinc-500">{p.category}</td>
                  <td className="p-3 text-zinc-800">{p.views.toLocaleString()}</td>
                  <td className="p-3 text-emerald-700 font-bold">{p.likes.toLocaleString()}</td>
                  <td className="p-3 text-red-600">{p.dislikes.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.approvalRatio >= 85
                          ? "bg-emerald-100 text-emerald-900"
                          : p.approvalRatio >= 70
                          ? "bg-amber-100 text-amber-900"
                          : "bg-red-100 text-red-900"
                      }`}
                    >
                      {p.approvalRatio}%
                    </span>
                  </td>
                  <td className="p-3 text-zinc-800 font-bold">{p.externalBuyClicks.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
