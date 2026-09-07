"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  getProductStockList,
  getStockMovements,
  recordInventoryAdjustment,
  getInventoryKpis,
  StockMovementRecord,
} from "@/lib/services/inventory";
import {
  getAllReviewsForModeration,
  moderateReview,
  ReviewItem,
} from "@/lib/services/reviews";
import {
  getAllDynamicProducts,
  createNewProduct,
  updateProductDetails,
  deleteProductRecord,
} from "@/lib/services/products-crud";
import {
  getAllSupportTickets,
  updateTicketStatus,
  SupportTicket,
} from "@/lib/services/support-tickets";
import { ProductItem } from "@/lib/catalog-data";
import { VerificationBadge, AuditorBadge } from "@/components/ui/VerificationBadge";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { WarehouseLabelModal } from "@/components/ui/WarehouseLabelModal";
import { BarcodeScannerModal } from "@/components/ui/BarcodeScannerModal";
import { ProductEditModal } from "@/components/management/ProductEditModal";
import { PurchaseOrderModal } from "@/components/management/PurchaseOrderModal";
import {
  getActiveStockAlerts,
  testDispatchWebhook,
  getWebhookConfig,
  updateWebhookConfig,
  StockAlert,
  WebhookConfig,
} from "@/lib/services/stock-alerts";
import {
  Box,
  Layers,
  FileCheck,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  Download,
  ShieldAlert,
  Search,
  Edit2,
  Trash2,
  MessageSquare,
  BarChart3,
  Clock,
  Send,
  QrCode,
  Bell,
  Webhook,
  Scan,
} from "lucide-react";

export default function ManagementPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "inventory" | "products" | "reviews" | "analytics" | "tickets" | "alerts" | "imports"
  >("inventory");

  const [products, setProducts] = useState<ProductItem[]>(getAllDynamicProducts());
  const [movements, setMovements] = useState<StockMovementRecord[]>(getStockMovements());
  const [reviews, setReviews] = useState<ReviewItem[]>(getAllReviewsForModeration());
  const [tickets, setTickets] = useState<SupportTicket[]>(getAllSupportTickets());
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>(getActiveStockAlerts());
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>(getWebhookConfig());
  const [alertDispatchMsg, setAlertDispatchMsg] = useState("");
  const [selectedLabelProduct, setSelectedLabelProduct] = useState<ProductItem | null>(null);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [poModalOpen, setPoModalOpen] = useState(false);
  const kpis = getInventoryKpis();

  // Stock Adjustment State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [movementType, setMovementType] = useState<"STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "DAMAGE">("ADJUSTMENT");
  const [quantity, setQuantity] = useState(10);
  const [mandatoryReason, setMandatoryReason] = useState("");
  const [adjustError, setAdjustError] = useState("");
  const [adjustSuccess, setAdjustSuccess] = useState("");

  // Product Filter State
  const [productSearch, setProductSearch] = useState("");

  // Add / Edit Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Review Rejection Reason State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // Active Ticket Transcript Viewer State
  const [viewingTicket, setViewingTicket] = useState<SupportTicket | null>(null);

  const handleStockAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdjustError("");
    setAdjustSuccess("");

    try {
      const res = await recordInventoryAdjustment({
        productId: selectedProductId,
        movementType,
        quantity,
        mandatoryReason,
        userEmail: "manager@verispec.local",
      });

      setAdjustSuccess(res.message);
      setProducts(getAllDynamicProducts());
      setMovements(getStockMovements());
      setTimeout(() => {
        setAdjustModalOpen(false);
        setMandatoryReason("");
        setAdjustSuccess("");
      }, 1500);
    } catch (err: unknown) {
      setAdjustError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleTestWebhook = async (alertItem: StockAlert) => {
    setAlertDispatchMsg(`Dispatching reorder webhook to ${webhookConfig.channel}...`);
    try {
      const res = await testDispatchWebhook(alertItem, "manager@verispec.local");
      setAlertDispatchMsg(res.message);
      setTimeout(() => setAlertDispatchMsg(""), 5000);
    } catch (err: unknown) {
      setAlertDispatchMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleReviewAction = async (reviewId: string, status: "APPROVED" | "REJECTED", reason?: string) => {
    try {
      await moderateReview({
        reviewId,
        status,
        rejectionReason: reason,
        moderatorEmail: "manager@verispec.local",
      });
      setReviews(getAllReviewsForModeration());
      setRejectModalOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const openEditProductModal = (p: ProductItem) => {
    setEditingProduct(p);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (p: ProductItem) => {
    const reason = prompt(
      `Confirm removal of "${p.name}" (${p.sku}). Please provide a mandatory reason for the audit trail:`
    );
    if (!reason || reason.trim().length < 5) {
      alert("Removal cancelled: A valid reason of at least 5 characters is required.");
      return;
    }

    try {
      await deleteProductRecord(p.id, "manager@verispec.local", reason);
      setProducts(getAllDynamicProducts());
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleTicketStatusChange = async (ticketId: string, status: "NEW" | "REVIEWED" | "RESOLVED") => {
    await updateTicketStatus(ticketId, status, "manager@verispec.local");
    setTickets(getAllSupportTickets());
  };

  return (
    <div className="pt-28 pb-24 px-6 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-semibold mb-2">
            <Box className="w-3.5 h-3.5" />
            <span>Operational Management & Inventory Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
            Operations & Analytics Control
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Maintain catalogue master items, inspect daily/monthly analytics graphs, manage stock movements, and review customer care tickets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setScannerModalOpen(true)}
            className="px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-850 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-zinc-200 shadow-2xs"
          >
            <Scan className="w-3.5 h-3.5 text-zinc-700" />
            <span>Scan Barcode / QR</span>
          </button>

          <button
            onClick={() => setAdjustModalOpen(true)}
            className="px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Stock Adjustment</span>
          </button>

          <button
            onClick={openNewProductModal}
            className="px-4 py-2 rounded-full bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Master Item</span>
          </button>

          <Link
            href="/admin"
            className="px-4 py-2 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
          >
            <span>Owner Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase">Master Products</div>
          <div className="text-2xl font-black text-zinc-950 mt-1">{products.length}</div>
          <div className="text-[10px] text-zinc-500 font-mono">19 Master + Demo</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-semibold text-amber-600 uppercase">Draft / Pending</div>
          <div className="text-2xl font-black text-amber-900 mt-1">
            {products.filter((p) => p.status === "DRAFT" || p.status === "PENDING_VERIFICATION").length}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">Requires SDS / Docs</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-semibold text-red-600 uppercase">Low Stock Alerts</div>
          <div className="text-2xl font-black text-red-700 mt-1">{kpis.lowStock}</div>
          <div className="text-[10px] text-zinc-500 font-mono">Below reorder pt</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase">Total Stock Units</div>
          <div className="text-2xl font-black text-zinc-950 mt-1">{kpis.totalUnits.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500 font-mono">2 Warehouses</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase">Est. Stock Value</div>
          <div className="text-2xl font-black text-zinc-950 mt-1">
            ₹{(kpis.totalStockValueInr / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">INR Reference</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
          <div className="text-[10px] font-semibold text-purple-600 uppercase">AI Support Tickets</div>
          <div className="text-2xl font-black text-purple-900 mt-1">
            {tickets.filter((t) => t.status === "NEW").length}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">Unresolved Inquiries</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-2">
        {[
          { id: "inventory", label: "Inventory Balances & Moves" },
          { id: "products", label: `Products Master (${products.length})` },
          { id: "analytics", label: "Daily / Monthly Analytics & Graphs" },
          { id: "tickets", label: `AI Support Tickets (${tickets.length})` },
          { id: "alerts", label: `Low-Stock Alerts & Webhooks (${stockAlerts.length})` },
          { id: "reviews", label: `Review Moderation (${reviews.length})` },
          { id: "imports", label: "CSV Import & Export" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Inventory Balances & Moves */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-950">Warehouse Stock Balances</h3>
              <span className="text-xs text-zinc-400 font-mono">{products.length} monitored items</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-600">
                    <th className="p-3.5">SKU</th>
                    <th className="p-3.5">Product Name</th>
                    <th className="p-3.5">Warehouse</th>
                    <th className="p-3.5">Current Stock</th>
                    <th className="p-3.5">Reserved</th>
                    <th className="p-3.5">Available</th>
                    <th className="p-3.5">Min Threshold</th>
                    <th className="p-3.5">Reorder Status</th>
                    <th className="p-3.5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map((p) => {
                    const isLow = p.inventory.currentStock <= p.inventory.minStock;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/80">
                        <td className="p-3.5 font-mono font-bold text-zinc-700">{p.sku}</td>
                        <td className="p-3.5 font-bold text-zinc-950">
                          <div className="flex items-center gap-2.5">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-8 h-8 rounded-lg object-cover border border-zinc-200 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-xs shrink-0">
                                📦
                              </div>
                            )}
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-zinc-500">{p.inventory.locationCode}</td>
                        <td className="p-3.5 font-bold text-zinc-900">
                          {p.inventory.currentStock} {p.unitOfMeasure}s
                        </td>
                        <td className="p-3.5 text-zinc-500">{p.inventory.reservedStock}</td>
                        <td className="p-3.5 text-zinc-800 font-semibold">{p.inventory.availableStock}</td>
                        <td className="p-3.5 font-mono text-zinc-500">{p.inventory.minStock}</td>
                        <td className="p-3.5">
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                              REORDER NEEDED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                              Optimal
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedLabelProduct(p);
                                setLabelModalOpen(true);
                              }}
                              className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                              title="Print QR & Barcode Bin Label"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProductId(p.id);
                                setAdjustModalOpen(true);
                              }}
                              className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[11px] font-semibold text-zinc-800 transition-colors"
                            >
                              Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Movement Audit Trail */}
          <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-950">Recent Stock Movements</h3>
                <p className="text-xs text-zinc-400">All adjustments strictly require a mandatory reason</p>
              </div>
              <span className="text-xs font-mono text-zinc-400">{movements.length} logged records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-600">
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Qty Change</th>
                    <th className="p-3.5">Stock (Before &rarr; After)</th>
                    <th className="p-3.5">Mandatory Reason</th>
                    <th className="p-3.5">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50/80">
                      <td className="p-3.5 text-zinc-400 font-mono text-[11px]">
                        {new Date(m.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-zinc-100 text-zinc-800">
                          {m.movementType}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-zinc-900">{m.productName}</td>
                      <td className="p-3.5 font-bold text-zinc-900">{m.quantity}</td>
                      <td className="p-3.5 font-mono text-zinc-600">
                        {m.previousStock} &rarr; {m.newStock}
                      </td>
                      <td className="p-3.5 text-zinc-700 italic max-w-xs truncate">
                        &ldquo;{m.mandatoryReason}&rdquo;
                      </td>
                      <td className="p-3.5 text-zinc-500 font-mono">{m.createdByUser}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Master with Inline Edit and Delete */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by SKU or name..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-zinc-200 bg-white text-xs"
              />
            </div>

            <button
              onClick={openNewProductModal}
              className="px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Draft Product</span>
            </button>
          </div>

          <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-950">
                Catalogue Master Database Sheet ({products.length} Items)
              </h3>
              <span className="text-xs font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                Live Editable
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-600">
                    <th className="p-3.5">SKU</th>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">UOM</th>
                    <th className="p-3.5">Ref Price (INR)</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products
                    .filter(
                      (p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.sku.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/80">
                        <td className="p-3.5 font-mono font-bold text-zinc-700">{p.sku}</td>
                        <td className="p-3.5 font-bold text-zinc-950">
                          <div className="flex items-center gap-2.5">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-8 h-8 rounded-lg object-cover border border-zinc-200 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-xs shrink-0">
                                📦
                              </div>
                            )}
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-zinc-600">{p.categoryName}</td>
                        <td className="p-3.5 font-mono text-zinc-500">{p.unitOfMeasure}</td>
                        <td className="p-3.5 font-bold text-zinc-900">₹{p.indicativePriceInr.toFixed(2)}</td>
                        <td className="p-3.5">
                          <VerificationBadge status={p.status} confidence={p.dataConfidenceLevel} />
                        </td>
                        <td className="p-3.5 font-mono text-zinc-700 font-semibold">
                          {p.inventory.currentStock}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/products/${p.slug}`}
                              className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedLabelProduct(p);
                                setLabelModalOpen(true);
                              }}
                              className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                              title="Print QR & Barcode Bin Label"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                              title="Edit specifications"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Daily / Monthly / Yearly Analytics & Visual Graphs */}
      {activeTab === "analytics" && (
        <div>
          <AnalyticsDashboard />
        </div>
      )}

      {/* Tab 4: AI Customer Support Tickets & Summaries */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-950">
                Customer Care Inquiries & AI Summaries
              </h3>
              <p className="text-xs text-zinc-400">
                Directly submitted and summarized by the Customer Care AI Bot on behalf of visitors
              </p>
            </div>
            <span className="text-xs font-mono text-purple-700 bg-purple-50 px-3 py-1 rounded-full font-bold">
              {tickets.length} Registered Incidents
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-bold">
                      {t.id} &bull; {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === "NEW"
                          ? "bg-purple-100 text-purple-800"
                          : t.status === "REVIEWED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-zinc-900">
                    Visitor: <span className="font-normal">{t.visitorName}</span> ({t.visitorEmail})
                  </div>
                  <div className="text-xs font-bold text-zinc-900">
                    Assigned Rep: <span className="text-cyan-700 font-semibold">{t.assignedRepName}</span> ({t.assignedRepRole})
                  </div>
                  <div className="text-xs font-bold text-zinc-900">
                    Category: <span className="text-zinc-600 font-normal">{t.issueCategory}</span>
                  </div>

                  {/* AI Structured Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs space-y-1">
                    <div className="font-bold text-purple-950 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-700" />
                      <span>AI Problem Summary:</span>
                    </div>
                    <p className="text-purple-900 leading-relaxed">{t.aiSummary}</p>
                    <div className="pt-2 text-[11px] text-purple-800 border-t border-purple-200/50">
                      <strong>Recommended Staff Action:</strong> {t.recommendedStaffAction}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <button
                    onClick={() => setViewingTicket(t)}
                    className="text-xs font-bold text-zinc-900 hover:underline flex items-center gap-1"
                  >
                    <span>View Transcript ({t.transcript.length} msgs)</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {t.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleTicketStatusChange(t.id, "RESOLVED")}
                        className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700"
                      >
                        Resolve
                      </button>
                    )}
                    {t.status === "NEW" && (
                      <button
                        onClick={() => handleTicketStatusChange(t.id, "REVIEWED")}
                        className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-semibold hover:bg-zinc-200"
                      >
                        Mark Reviewed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Review Moderation Queue */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-950">Review Moderation Queue</h3>
            <span className="text-xs text-zinc-400 font-mono">
              Pending: {reviews.filter((r) => r.status === "PENDING").length} | Approved:{" "}
              {reviews.filter((r) => r.status === "APPROVED").length}
            </span>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">{rev.reviewerName}</span>
                    <span className="text-[10px] text-zinc-400">({rev.reviewerEmail})</span>
                    {rev.isAuditorVerified && (
                      <AuditorBadge role={rev.reviewerRole} registrationNumber={rev.auditorRegistrationNumber} />
                    )}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        rev.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : rev.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-500">
                    Product: <strong className="text-zinc-800">{rev.productName}</strong> &bull; Rating:{" "}
                    <span className="text-amber-600 font-bold">{rev.rating}/5</span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-950">&ldquo;{rev.title}&rdquo;</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">{rev.content}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rev.status !== "APPROVED" && (
                    <button
                      onClick={() => handleReviewAction(rev.id, "APPROVED")}
                      className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {rev.status !== "REJECTED" && (
                    <button
                      onClick={() => {
                        setSelectedReviewId(rev.id);
                        setRejectModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Low-Stock Automated Webhooks & Alerts */}
      {activeTab === "alerts" && (
        <div className="space-y-6 text-xs">
          {/* Top Banner & Webhook Dispatch Toast */}
          {alertDispatchMsg && (
            <div className="p-3.5 rounded-2xl bg-zinc-950 text-white font-mono flex items-center justify-between shadow-lg">
              <span>{alertDispatchMsg}</span>
              <span className="text-[10px] text-zinc-400">Audit Log Recorded</span>
            </div>
          )}

          {/* Webhook Channel Config Card */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900">
                <Webhook className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950">Automated Reorder Threshold Webhook Daemon</h3>
                <p className="text-zinc-500">
                  Broadcasts instant notifications to procurement teams when warehouse stock falls below minimum levels.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={webhookConfig.channel}
                onChange={(e) =>
                  setWebhookConfig(updateWebhookConfig({ channel: e.target.value as WebhookConfig["channel"] }))
                }
                className="px-3 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-800"
              >
                <option value="SLACK">Slack Webhook</option>
                <option value="EMAIL">Procurement Email Gateway</option>
                <option value="SMS">Emergency SMS API</option>
              </select>

              <button
                onClick={() =>
                  alert(`Webhook configuration updated! Active channel: ${webhookConfig.channel}. Endpoint: ${webhookConfig.endpointUrl}`)
                }
                className="px-4 py-1.5 rounded-full bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800"
              >
                Save Channel
              </button>
            </div>
          </div>

          {/* Alert Table */}
          <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-zinc-950">Triggered Threshold Breaches</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                  {stockAlerts.length} Critical
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPoModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Generate Reorder PO Requisition</span>
                </button>
              </div>
            </div>

            {stockAlerts.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                All inventory items are currently above minimum safety thresholds.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-600">
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">Product Name</th>
                      <th className="p-3.5">Warehouse</th>
                      <th className="p-3.5">Current Stock</th>
                      <th className="p-3.5">Min Threshold</th>
                      <th className="p-3.5">Stock Deficit</th>
                      <th className="p-3.5">Suggested Reorder</th>
                      <th className="p-3.5">Severity</th>
                      <th className="p-3.5 text-right">Webhook Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {stockAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-zinc-50/80">
                        <td className="p-3.5 font-mono font-bold text-zinc-700">{alert.sku}</td>
                        <td className="p-3.5 font-bold text-zinc-950">{alert.productName}</td>
                        <td className="p-3.5 font-mono text-zinc-500">{alert.locationCode}</td>
                        <td className="p-3.5 font-mono font-bold text-red-700">{alert.currentStock}</td>
                        <td className="p-3.5 font-mono text-zinc-500">{alert.minStock}</td>
                        <td className="p-3.5 font-mono text-red-600">-{alert.deficit} units</td>
                        <td className="p-3.5 font-mono text-zinc-800 font-semibold">{alert.suggestedReorderQty} units</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              alert.severity === "CRITICAL"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleTestWebhook(alert)}
                            className="px-3 py-1 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-bold transition-all shadow-xs"
                          >
                            Dispatch Notice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: CSV Import & Export */}
      {activeTab === "imports" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Download Standard CSV Templates</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Ensure data integrity by using our official import templates. Includes columns for identity, PPE attributes, and chemical safety placeholders.
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="/templates/product-import-template.csv"
                download
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-between"
              >
                <span>Product Master Import Template (CSV)</span>
                <Download className="w-3.5 h-3.5 text-zinc-500" />
              </a>
              <a
                href="/templates/inventory-import-template.csv"
                download
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-between"
              >
                <span>Inventory Movements Template (with mandatory reasons)</span>
                <Download className="w-3.5 h-3.5 text-zinc-500" />
              </a>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Upload Product or Stock CSV</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              All imports run duplicate detection and schema validation. Records are never overwritten silently.
            </p>

            <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-6 text-center text-xs text-zinc-500 space-y-2 hover:border-zinc-500 transition-colors">
              <FileText className="w-8 h-8 text-zinc-400 mx-auto" />
              <div>Drag & drop CSV file or click to browse</div>
              <span className="text-[10px] text-zinc-400 block font-mono">Max 10 MB &bull; UTF-8 CSV</span>
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-950 mb-1">Record Stock Movement</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Requires a mandatory reason for audit trail recording.
            </p>

            {adjustSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs mb-3 font-semibold">
                {adjustSuccess}
              </div>
            )}

            {adjustError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-900 text-xs mb-3 font-semibold">
                {adjustError}
              </div>
            )}

            <form onSubmit={handleStockAdjustmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Select Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) &bull; Current: {p.inventory.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Movement Type</label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as typeof movementType)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs bg-white"
                >
                  <option value="STOCK_IN">Stock In (Supplier Receiving)</option>
                  <option value="STOCK_OUT">Stock Out (Dispatch)</option>
                  <option value="ADJUSTMENT">Stock Adjustment (Audit Correction)</option>
                  <option value="DAMAGE">Damage Quarantine</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">
                  Mandatory Justification Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={mandatoryReason}
                  onChange={(e) => setMandatoryReason(e.target.value)}
                  placeholder="Explain why this adjustment is taking place (at least 5 characters)..."
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-zinc-950 text-white font-semibold"
                >
                  Execute Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductEditModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSaved={(updatedList) => setProducts(updatedList)}
        productToEdit={editingProduct}
        currentUserEmail="manager@verispec.local"
      />

      {/* Transcript Viewer Modal */}
      {viewingTicket && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-zinc-200 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div>
                <h3 className="text-sm font-bold text-zinc-950">
                  Chat Transcript &bull; {viewingTicket.id}
                </h3>
                <span className="text-xs text-zinc-400">
                  Visitor: {viewingTicket.visitorName} | Rep: {viewingTicket.assignedRepName}
                </span>
              </div>
              <button
                onClick={() => setViewingTicket(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-900"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs">
              {viewingTicket.transcript.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-zinc-100 text-zinc-800 ml-6"
                      : "bg-purple-50 text-purple-950 mr-6 border border-purple-100"
                  }`}
                >
                  <div className="font-bold text-[10px] uppercase text-zinc-400 mb-1">
                    {msg.sender === "user" ? viewingTicket.visitorName : viewingTicket.assignedRepName}
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setViewingTicket(null)}
                className="px-5 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-zinc-200 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-950 mb-2">Provide Rejection Reason</h3>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Promotional content, duplicate submission, or unverified claims..."
              className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs mb-3"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewAction(selectedReviewId, "REJECTED", rejectReason)}
                className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warehouse QR & Barcode Bin Label Modal */}
      <WarehouseLabelModal
        product={selectedLabelProduct}
        isOpen={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
      />

      {/* Handheld & Camera Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        onSelectProductForAdjustment={(prodId) => {
          setSelectedProductId(prodId);
          setAdjustModalOpen(true);
        }}
      />

      {/* Autonomous Reorder Purchase Order Modal */}
      <PurchaseOrderModal
        isOpen={poModalOpen}
        onClose={() => setPoModalOpen(false)}
        alerts={stockAlerts}
        allProducts={products}
      />
    </div>
  );
}
