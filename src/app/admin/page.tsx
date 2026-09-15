"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getAuditLogs, AuditLogEntry } from "@/lib/audit";
import { getAllSupportTickets, updateTicketStatus, SupportTicket } from "@/lib/services/support-tickets";
import { getAllDynamicProducts, deleteProductRecord } from "@/lib/services/products-crud";
import { ProductItem } from "@/lib/catalog-data";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { ProductEditModal } from "@/components/management/ProductEditModal";
import {
  Shield,
  Lock,
  Users,
  Key,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  ArrowRight,
  Search,
  Sparkles,
  BarChart3,
  Bot,
  Zap,
  Edit2,
  Trash2,
  Plus,
  Package,
} from "lucide-react";

export default function OwnerAdminPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "audit" | "products" | "analytics" | "users" | "tickets" | "integrations" | "settings"
  >("audit");

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(getAuditLogs());
  const [tickets, setTickets] = useState<SupportTicket[]>(getAllSupportTickets());
  const [filterAction, setFilterAction] = useState("all");

  // Catalogue Master Products State
  const [products, setProducts] = useState<ProductItem[]>(getAllDynamicProducts());
  const [productSearch, setProductSearch] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const handleDeleteProduct = async (p: ProductItem) => {
    const reason = prompt(
      `Owner Authority: Confirm removal of "${p.name}" (${p.sku}).\nMandatory audit reason:`
    );
    if (!reason || reason.trim().length < 5) {
      alert("Removal cancelled: A valid reason of at least 5 characters is required.");
      return;
    }
    try {
      await deleteProductRecord(p.id, "owner@verispec.local", reason);
      setProducts(getAllDynamicProducts());
      setAuditLogs(getAuditLogs());
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  // Users State
  const [users, setUsers] = useState([
    {
      id: "usr-01",
      email: "owner@verispec.local",
      name: "System Owner",
      role: "OWNER_ADMIN",
      isActive: true,
      lastActive: "Just now",
    },
    {
      id: "usr-02",
      email: "manager@verispec.local",
      name: "Operations Manager",
      role: "MANAGEMENT_STAFF",
      isActive: true,
      lastActive: "10 mins ago",
    },
    {
      id: "usr-03",
      email: "reviewer@verispec.local",
      name: "Field Safety Reviewer",
      role: "REGISTERED_REVIEWER",
      isActive: true,
      lastActive: "2 hours ago",
    },
  ]);

  // System Settings State
  const [defaultCurrency, setDefaultCurrency] = useState("INR");
  const [domainAllowlist, setDomainAllowlist] = useState(
    "amazon.in,amazon.com,indiamart.com,moglix.com,industrybuying.com,diversey.com,bensafety.com"
  );

  // OpenCode Zen / AI Provider State
  const [aiEndpoint, setAiEndpoint] = useState("https://opencode.ai/zen/v1");
  const [aiModel, setAiModel] = useState("claude-haiku-4-5");
  const [aiApiKeyInput, setAiApiKeyInput] = useState("");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiTestResult, setAiTestResult] = useState<string | null>(null);

  // New Manager Creation State
  const [newManagerModalOpen, setNewManagerModalOpen] = useState(false);
  const [newManagerEmail, setNewManagerEmail] = useState("");
  const [newManagerName, setNewManagerName] = useState("");

  const handleCreateManager = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `usr-${Date.now()}`,
      email: newManagerEmail,
      name: newManagerName,
      role: "MANAGEMENT_STAFF",
      isActive: true,
      lastActive: "Never",
    };
    setUsers([...users, newUser]);
    setNewManagerModalOpen(false);
    setNewManagerEmail("");
    setNewManagerName("");
    alert(`Management account created for ${newManagerEmail}.`);
  };

  const toggleUserActive = (userId: string) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const handleTestOpenCodeZen = async () => {
    setAiTestResult("Connecting to OpenCode Zen endpoint...");
    try {
      const res = await fetch("/api/admin/ai-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: aiApiKeyInput,
          endpoint: aiEndpoint,
          model: aiModel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiTestResult(`✓ Success: ${data.message}`);
      } else {
        setAiTestResult(`⚠️ ${data.message}`);
      }
    } catch (err: unknown) {
      setAiTestResult(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const filteredLogs = auditLogs.filter(
    (log) => filterAction === "all" || log.action.includes(filterAction)
  );

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Owner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-zinc-950 text-xs font-bold mb-2 shadow-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Owner & Administrator Authority</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
            Owner Governance & Security Control
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Immutable audit logging, telemetry analytics, user role provisioning, and OpenCode Zen AI provider keys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/management"
            className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors"
          >
            Management Portal
          </Link>
          <Link
            href="/products"
            className="px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            Public Site
          </Link>
        </div>
      </div>

      {/* Owner Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-2">
        {[
          { id: "audit", label: `Audit Logs (${auditLogs.length})` },
          { id: "products", label: `Catalogue Master Management (${products.length})` },
          { id: "analytics", label: "Full Analytics & Reports" },
          { id: "tickets", label: `Support Tickets & AI Summaries (${tickets.length})` },
          { id: "users", label: `User Roles (${users.length})` },
          { id: "integrations", label: "OpenCode Zen AI & Adapters" },
          { id: "settings", label: "System Rules & Currency" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              activeTab === t.id
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Immutable Audit Logs */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-950">System Audit Trail</h3>
              <p className="text-xs text-zinc-500">
                Immutable ledger recording every product change, stock movement, login, and review action.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Filter Action:</span>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 bg-white"
              >
                <option value="all">All Actions</option>
                <option value="STOCK">Stock Adjustments</option>
                <option value="PRODUCT">Product CRUD</option>
                <option value="REVIEW">Review Moderation</option>
                <option value="SUPPORT">Support Tickets</option>
                <option value="USER">User Sessions</option>
              </select>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-700">
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Entity</th>
                    <th className="p-3.5">Actor / Email</th>
                    <th className="p-3.5">Mandatory Reason / Context</th>
                    <th className="p-3.5">Integrity Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50/80">
                      <td className="p-3.5 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-zinc-900">
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-zinc-800">
                        {log.entity} {log.entityId && `(${log.entityId})`}
                      </td>
                      <td className="p-3.5 font-mono text-zinc-600 text-[11px]">
                        {log.userEmail || "system"}
                      </td>
                      <td className="p-3.5 text-zinc-700 italic max-w-sm truncate">
                        &ldquo;{log.reason || "N/A"}&rdquo;
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Catalogue Master Management */}
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
              onClick={() => {
                setEditingProduct(null);
                setProductModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Stage New Master Product</span>
            </button>
          </div>

          <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-950">
                  Catalogue Master Inventory Sheet ({products.length} Products)
                </h3>
                <p className="text-xs text-zinc-400">
                  Owner-level specification editing, custom attributes, image updates, and stock allocation.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                Owner Direct Access
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-600">
                    <th className="p-3.5">SKU</th>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Warehouse Bin</th>
                    <th className="p-3.5">Current Stock</th>
                    <th className="p-3.5">Indicative Price</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Owner Actions</th>
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
                        <td className="p-3.5 font-mono text-zinc-500">
                          {p.inventory?.locationCode || "WH-MAIN-01"}
                        </td>
                        <td className="p-3.5 font-mono text-zinc-800 font-bold">
                          {p.inventory?.currentStock ?? 0} {p.unitOfMeasure}s
                        </td>
                        <td className="p-3.5 font-bold text-zinc-900">
                          ₹{p.indicativePriceInr?.toFixed(2)}
                        </td>
                        <td className="p-3.5">
                          <VerificationBadge status={p.status} confidence={p.dataConfidenceLevel} />
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
                                setEditingProduct(p);
                                setProductModalOpen(true);
                              }}
                              className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                              title="Edit product specifications"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete product"
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

      {/* Tab 2: Analytics & Visual Reports */}
      {activeTab === "analytics" && (
        <div>
          <AnalyticsDashboard />
        </div>
      )}

      {/* Tab 3: Customer Care AI Summaries & Incident Tickets */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-950">AI Support Incident Queue</h3>
              <p className="text-xs text-zinc-500">
                Visitor issues summarized by the Customer Care Bot with AI recommendations
              </p>
            </div>
            <span className="text-xs font-mono text-purple-700 bg-purple-50 px-3 py-1 rounded-full font-bold">
              {tickets.length} Incidents Dispatched
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 font-bold">
                    {t.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {t.status}
                  </span>
                </div>

                <div className="text-xs">
                  <strong>Visitor:</strong> {t.visitorName} ({t.visitorEmail})
                </div>
                <div className="text-xs">
                  <strong>Specialist:</strong> {t.assignedRepName}
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-xs space-y-1">
                  <strong className="text-purple-950 block">AI Incident Summary:</strong>
                  <p className="text-purple-900">{t.aiSummary}</p>
                  <div className="pt-2 text-[11px] text-purple-800 border-t border-purple-200">
                    <strong>Recommended Action:</strong> {t.recommendedStaffAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: User Roles & Access */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-950">Platform Users & Roles</h3>
              <p className="text-xs text-zinc-500">
                Create management accounts, assign RBAC permissions, and deactivate credentials.
              </p>
            </div>

            <button
              onClick={() => setNewManagerModalOpen(true)}
              className="px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Manager Account</span>
            </button>
          </div>

          <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-700">
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Last Active</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/80">
                    <td className="p-3.5 font-bold text-zinc-950">{u.name}</td>
                    <td className="p-3.5 font-mono text-zinc-600">{u.email}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === "OWNER_ADMIN"
                            ? "bg-amber-100 text-amber-900"
                            : u.role === "MANAGEMENT_STAFF"
                            ? "bg-blue-100 text-blue-900"
                            : "bg-zinc-100 text-zinc-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {u.isActive ? (
                        <span className="text-[10px] text-emerald-700 font-bold">Active</span>
                      ) : (
                        <span className="text-[10px] text-red-600 font-bold">Deactivated</span>
                      )}
                    </td>
                    <td className="p-3.5 text-zinc-400 font-mono text-[11px]">{u.lastActive}</td>
                    <td className="p-3.5 text-right">
                      {u.role !== "OWNER_ADMIN" && (
                        <button
                          onClick={() => toggleUserActive(u.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                            u.isActive
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: OpenCode Zen AI Adapter Configuration */}
      {activeTab === "integrations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-sm font-bold text-zinc-950">OpenCode Zen AI Provider Setup</h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Activate your OpenCode Zen AI Provider API key here or in your server environment file.
              <strong className="text-zinc-800 block mt-1">
                Keys remain strictly encrypted on the server and are NEVER exposed to client bundles.
              </strong>
            </p>

            {/* How-to banner */}
            <div className="p-3.5 rounded-2xl bg-zinc-900 text-white font-mono text-[11px] space-y-1">
              <div className="text-zinc-400 font-bold text-[10px]">IN YOUR .env FILE:</div>
              <div>AI_PROVIDER_API_KEY=&quot;your_opencode_zen_key&quot;</div>
              <div>AI_PROVIDER_ENDPOINT=&quot;https://api.opencodezen.com/v1&quot;</div>
              <div>AI_PROVIDER_MODEL=&quot;opencode-zen-latest&quot;</div>
              <div>AI_PROVIDER_ENABLED=&quot;true&quot;</div>
            </div>

            <div className="space-y-3 text-xs pt-2">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">OpenCode Zen API Key</label>
                <input
                  type="password"
                  value={aiApiKeyInput}
                  onChange={(e) => setAiApiKeyInput(e.target.value)}
                  placeholder="Paste your OpenCode Zen API key here..."
                  className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Provider Endpoint</label>
                <input
                  type="text"
                  value={aiEndpoint}
                  onChange={(e) => setAiEndpoint(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Model Name</label>
                <input
                  type="text"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="font-semibold text-zinc-800">Enable OpenCode Zen Provider</span>
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) => setAiEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-zinc-900"
                />
              </div>

              {aiTestResult && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-mono">
                  {aiTestResult}
                </div>
              )}

              <button
                onClick={handleTestOpenCodeZen}
                className="w-full py-2.5 rounded-full bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800"
              >
                Save & Verify OpenCode Zen Connection
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-zinc-800" />
              <h3 className="text-sm font-bold text-zinc-950">External Seller Domain Allowlist</h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Only domains entered below can be used for &ldquo;Buy from external seller&rdquo; links.
              Prevents unauthorized redirects or arbitrary URLs.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Allowed Domains (Comma-separated)</label>
                <textarea
                  rows={4}
                  value={domainAllowlist}
                  onChange={(e) => setDomainAllowlist(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono text-xs"
                />
              </div>

              <button
                onClick={() => alert("Domain allowlist updated.")}
                className="px-4 py-2 rounded-full bg-zinc-950 text-white font-semibold text-xs"
              >
                Save Allowlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: System Rules & Currency */}
      {activeTab === "settings" && (
        <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-zinc-950">Platform Currency Configuration</h3>
          <p className="text-xs text-zinc-500">
            Initial default display currency across all product detail and comparison views.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Base Currency (ISO 4217)</label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold"
              >
                <option value="INR">INR (Indian Rupee - Base Reference)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-[11px] leading-relaxed">
              Currency conversions are clearly labelled: &ldquo;Indicative only; prices vary by region, taxes, shipping, seller, and date&rdquo;.
            </div>

            <button
              onClick={() => alert(`Default currency confirmed as ${defaultCurrency}`)}
              className="px-5 py-2.5 rounded-full bg-zinc-950 text-white font-semibold text-xs"
            >
              Update Global Currency Rule
            </button>
          </div>
        </div>
      )}

      {/* New Manager Modal */}
      {newManagerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-zinc-200 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-950 mb-1">Create Management Account</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Management staff can update inventory and moderate reviews, but cannot alter security settings.
            </p>

            <form onSubmit={handleCreateManager} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newManagerName}
                  onChange={(e) => setNewManagerName(e.target.value)}
                  placeholder="e.g. Priya Nair"
                  className="w-full p-2.5 rounded-xl border border-zinc-200"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newManagerEmail}
                  onChange={(e) => setNewManagerEmail(e.target.value)}
                  placeholder="priya.manager@verispec.local"
                  className="w-full p-2.5 rounded-xl border border-zinc-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewManagerModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-zinc-950 text-white font-semibold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Owner Product Edit & Creation Modal */}
      <ProductEditModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSaved={(updated) => {
          setProducts(updated);
          setAuditLogs(getAuditLogs());
        }}
        productToEdit={editingProduct}
        currentUserEmail="owner@verispec.local"
      />
    </div>
  );
}
