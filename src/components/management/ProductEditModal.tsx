"use client";

import React, { useState, useEffect } from "react";
import { ProductItem, INITIAL_CATEGORIES } from "@/lib/catalog-data";
import {
  updateProductDetails,
  createNewProduct,
  deleteProductRecord,
  getAllDynamicProducts,
} from "@/lib/services/products-crud";
import {
  X,
  Upload,
  Image as ImageIcon,
  Layers,
  FileText,
  Warehouse,
  ShieldCheck,
  DollarSign,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Tag,
} from "lucide-react";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (products: ProductItem[]) => void;
  productToEdit?: ProductItem | null;
  currentUserEmail?: string;
}

const PRESET_IMAGES = [
  { label: "Respirator Mask", url: "/images/hero_respirator.jpg" },
  { label: "Nitrile Barrier Gloves", url: "/images/hero_gloves.jpg" },
  { label: "Safety Helmet & Visor", url: "/images/hero_helmet.jpg" },
  { label: "Hazardous Containment Drum", url: "/images/hero_hazardous.jpg" },
  {
    label: "Splash Safety Goggles",
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Steel Toe Boots",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Industrial Coverall",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Emergency Eyewash Station",
    url: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80",
  },
];

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  productToEdit,
  currentUserEmail = "manager@verispec.local",
}) => {
  const [activeTab, setActiveTab] = useState<
    "media" | "identity" | "logistics" | "specs" | "commercial" | "governance"
  >("media");

  // Form states
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("cat-1");
  const [categoryName, setCategoryName] = useState("Personal Protective Equipment (PPE)");
  const [brandName, setBrandName] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("India");
  const [unitOfMeasure, setUnitOfMeasure] = useState("piece");

  // Media
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Warehouse / Logistics
  const [currentStock, setCurrentStock] = useState(100);
  const [minStock, setMinStock] = useState(25);
  const [reservedStock, setReservedStock] = useState(10);
  const [reorderQty, setReorderQty] = useState(100);
  const [locationCode, setLocationCode] = useState("WH-MAIN-01");
  const [locationName, setLocationName] = useState("Main Distribution Center");

  // Pricing & External Seller
  const [indicativePriceInr, setIndicativePriceInr] = useState(250);
  const [sellerName, setSellerName] = useState("Authorized Safety Supplier");
  const [sellerUrl, setSellerUrl] = useState("https://www.indiamart.com");
  const [sellerPrice, setSellerPrice] = useState(250);

  // Descriptions & Warnings
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [warnings, setWarnings] = useState("");

  // Custom Technical Specifications (Dynamic Key-Value Pairs)
  const [customSpecs, setCustomSpecs] = useState<Array<{ key: string; value: string }>>([]);

  // Governance
  const [status, setStatus] = useState<ProductItem["status"]>("DRAFT");
  const [dataConfidenceLevel, setDataConfidenceLevel] =
    useState<ProductItem["dataConfidenceLevel"]>("UNVERIFIED");
  const [isPubliclyVisible, setIsPubliclyVisible] = useState(true);
  const [auditReason, setAuditReason] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setSku(productToEdit.sku || "");
      setCategoryId(productToEdit.categoryId || "cat-1");
      setCategoryName(productToEdit.categoryName || "Personal Protective Equipment (PPE)");
      setBrandName(productToEdit.brandName || "");
      setManufacturerName(productToEdit.manufacturerName || "");
      setCountryOfOrigin(productToEdit.countryOfOrigin || "India");
      setUnitOfMeasure(productToEdit.unitOfMeasure || "piece");

      setImageUrl(productToEdit.imageUrl || "");

      if (productToEdit.inventory) {
        setCurrentStock(productToEdit.inventory.currentStock ?? 0);
        setMinStock(productToEdit.inventory.minStock ?? 25);
        setReservedStock(productToEdit.inventory.reservedStock ?? 0);
        setReorderQty(productToEdit.inventory.reorderQty ?? 50);
        setLocationCode(productToEdit.inventory.locationCode || "WH-MAIN-01");
        setLocationName(productToEdit.inventory.locationName || "Main Distribution Center");
      }

      setIndicativePriceInr(productToEdit.indicativePriceInr || 250);
      if (productToEdit.externalPurchaseLinks && productToEdit.externalPurchaseLinks.length > 0) {
        const firstLink = productToEdit.externalPurchaseLinks[0];
        setSellerName(firstLink.sellerName || "Authorized Safety Supplier");
        setSellerUrl(firstLink.url || "https://www.indiamart.com");
        setSellerPrice(firstLink.price || productToEdit.indicativePriceInr || 250);
      }

      setShortDesc(productToEdit.shortDescription || "");
      setFullDesc(productToEdit.fullDescription || "");
      setWarnings(productToEdit.limitationsAndWarnings || "");

      // Populate custom specifications
      if (productToEdit.customAttributes && productToEdit.customAttributes.length > 0) {
        setCustomSpecs(JSON.parse(JSON.stringify(productToEdit.customAttributes)));
      } else {
        // Synthesize initial specs from PPE or Chemical details if available
        const initialPairs: Array<{ key: string; value: string }> = [];
        if (productToEdit.ppeDetail) {
          if (productToEdit.ppeDetail.material)
            initialPairs.push({ key: "Material", value: productToEdit.ppeDetail.material });
          if (productToEdit.ppeDetail.thickness)
            initialPairs.push({ key: "Thickness", value: productToEdit.ppeDetail.thickness });
          if (productToEdit.ppeDetail.applicableStandards)
            initialPairs.push({ key: "Standards", value: productToEdit.ppeDetail.applicableStandards });
          if (productToEdit.ppeDetail.latexFreeStatus)
            initialPairs.push({ key: "Latex Free", value: productToEdit.ppeDetail.latexFreeStatus });
        } else if (productToEdit.chemicalDetail) {
          if (productToEdit.chemicalDetail.productForm)
            initialPairs.push({ key: "Product Form", value: productToEdit.chemicalDetail.productForm });
          if (productToEdit.chemicalDetail.hazardClassification)
            initialPairs.push({
              key: "Hazard Classification",
              value: productToEdit.chemicalDetail.hazardClassification,
            });
          if (productToEdit.chemicalDetail.phValue)
            initialPairs.push({ key: "pH Value", value: productToEdit.chemicalDetail.phValue });
        }
        setCustomSpecs(
          initialPairs.length > 0
            ? initialPairs
            : [
                { key: "Material", value: "Industrial grade polymer" },
                { key: "Standard", value: "Requires manufacturer SDS/label verification" },
              ]
        );
      }

      setStatus(productToEdit.status || "DRAFT");
      setDataConfidenceLevel(productToEdit.dataConfidenceLevel || "UNVERIFIED");
      setIsPubliclyVisible(productToEdit.isPubliclyVisible !== false);
      setAuditReason(`Update specs for ${productToEdit.sku}`);
    } else {
      // New Product Defaults
      setName("");
      setSku(`VS-NEW-${Math.floor(100 + Math.random() * 900)}`);
      setCategoryId("cat-1");
      setCategoryName("Personal Protective Equipment (PPE)");
      setBrandName("Industrial Safety Brand");
      setManufacturerName("Pending Verification");
      setCountryOfOrigin("India");
      setUnitOfMeasure("piece");
      setImageUrl(PRESET_IMAGES[0].url);
      setCurrentStock(100);
      setMinStock(25);
      setReservedStock(10);
      setReorderQty(100);
      setLocationCode("WH-MAIN-01");
      setLocationName("Main Distribution Center");
      setIndicativePriceInr(350);
      setSellerName("Authorized Safety Supplier");
      setSellerUrl("https://www.indiamart.com");
      setSellerPrice(350);
      setShortDesc("Industrial master product record staged for facility compliance.");
      setFullDesc("High-durability safety equipment verified for industrial workplace environments.");
      setWarnings("Requires manufacturer SDS/label verification prior to hazardous deployment.");
      setCustomSpecs([
        { key: "Material", value: "Reinforced composite" },
        { key: "Safety Compliance", value: "Requires manufacturer SDS/label verification" },
      ]);
      setStatus("DRAFT");
      setDataConfidenceLevel("UNVERIFIED");
      setIsPubliclyVisible(true);
      setAuditReason("Initial staging of new catalogue master product");
    }

    setErrorMessage("");
    setSuccessMessage("");
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = e.target.value;
    const cat = INITIAL_CATEGORIES.find((c) => c.id === catId);
    setCategoryId(catId);
    if (cat) {
      setCategoryName(cat.name);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    setImageUploadLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setImageUploadLoading(false);
    };
    reader.onerror = () => {
      alert("Failed to read image file.");
      setImageUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const addCustomSpecRow = (defaultKey = "", defaultValue = "") => {
    setCustomSpecs([...customSpecs, { key: defaultKey, value: defaultValue }]);
  };

  const removeCustomSpecRow = (index: number) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== index));
  };

  const updateCustomSpecRow = (index: number, field: "key" | "value", val: string) => {
    const updated = [...customSpecs];
    updated[index][field] = val;
    setCustomSpecs(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const availableStock = Math.max(0, currentStock - reservedStock);

      const payload: Partial<ProductItem> = {
        name,
        slug: productToEdit?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sku,
        categoryId,
        categoryName,
        categorySlug:
          INITIAL_CATEGORIES.find((c) => c.id === categoryId)?.slug || "ppe",
        brandName: brandName || "Pending Verification",
        manufacturerName: manufacturerName || "Pending Verification",
        countryOfOrigin: countryOfOrigin || "Not Provided",
        unitOfMeasure,
        imageUrl,
        indicativePriceInr: Number(indicativePriceInr),
        shortDescription: shortDesc,
        fullDescription: fullDesc,
        limitationsAndWarnings: warnings,
        status,
        dataConfidenceLevel,
        isPubliclyVisible,
        customAttributes: customSpecs.filter((s) => s.key.trim() !== ""),
        inventory: {
          currentStock: Number(currentStock),
          minStock: Number(minStock),
          reservedStock: Number(reservedStock),
          availableStock,
          reorderQty: Number(reorderQty),
          locationCode,
          locationName,
        },
        externalPurchaseLinks: [
          {
            sellerName: sellerName || "Authorized Safety Supplier",
            url: sellerUrl || "https://www.indiamart.com",
            currency: "INR",
            price: Number(sellerPrice) || Number(indicativePriceInr),
            destinationCountry: "IN",
            lastChecked: new Date().toISOString().split("T")[0],
          },
        ],
      };

      if (productToEdit) {
        await updateProductDetails(
          productToEdit.id,
          payload,
          currentUserEmail,
          auditReason || `Updated by ${currentUserEmail}`
        );
        setSuccessMessage(`Product "${name}" updated successfully!`);
      } else {
        await createNewProduct(payload, currentUserEmail);
        setSuccessMessage(`Product "${name}" staged successfully!`);
      }

      setTimeout(() => {
        onSaved(getAllDynamicProducts());
        onClose();
      }, 1000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productToEdit) return;

    const reason = prompt(
      `Confirm permanent removal of "${productToEdit.name}" (${productToEdit.sku}).\nMandatory audit reason required:`
    );
    if (!reason || reason.trim().length < 5) {
      alert("Removal cancelled: A valid reason of at least 5 characters is required for regulatory audit compliance.");
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteProductRecord(productToEdit.id, currentUserEmail, reason);
      onSaved(getAllDynamicProducts());
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-950">
                  {productToEdit ? `Edit Product Specifications` : `Stage New Master Product`}
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-bold">
                  {sku || "AUTO-SKU"}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Full authority customizer for Management and System Owner with audit trail logging.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-zinc-200 bg-white overflow-x-auto text-xs font-semibold">
          {[
            { id: "media", label: "Media & Image", icon: ImageIcon },
            { id: "identity", label: "Identity & Core", icon: Tag },
            { id: "logistics", label: "Logistics & Stock", icon: Warehouse },
            { id: "specs", label: "Custom Specs", icon: FileText },
            { id: "commercial", label: "Pricing & Suppliers", icon: DollarSign },
            { id: "governance", label: "Status & Audit", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-zinc-950 text-zinc-950 font-bold bg-zinc-50/50 rounded-t-xl"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: MEDIA & IMAGE */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Live Preview Box */}
                <div className="p-4 rounded-3xl bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                    Live Photo Preview
                  </span>
                  <div className="w-44 h-44 rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-xs relative">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 p-4">
                        <ImageIcon className="w-8 h-8 mb-2 stroke-1" />
                        <span>No image provided</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono break-all line-clamp-1">
                    {imageUrl || "Awaiting image source"}
                  </span>
                </div>

                {/* Image Input Options */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-zinc-900 font-bold mb-1.5">
                      Direct Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/photos/respirator.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white font-mono text-xs focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>

                  <div className="p-4 rounded-2xl border-2 border-dashed border-zinc-300 hover:border-zinc-500 transition-colors bg-white text-center">
                    <input
                      type="file"
                      accept="image/*"
                      id="product-photo-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="product-photo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-1"
                    >
                      <Upload className="w-6 h-6 text-zinc-500 mb-1" />
                      <span className="font-bold text-zinc-900">
                        {imageUploadLoading ? "Processing photo..." : "Upload Local Photo from Device"}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Instant base64 data encoding &bull; PNG, JPG, WebP supported
                      </span>
                    </label>
                  </div>

                  {/* 1-Click Industrial Presets */}
                  <div>
                    <label className="block text-zinc-900 font-bold mb-1.5 flex items-center justify-between">
                      <span>Or Choose from 8 Verified Industrial Presets</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            imageUrl === preset.url
                              ? "border-zinc-950 bg-zinc-100 font-bold text-zinc-950 ring-1 ring-zinc-950"
                              : "border-zinc-200 hover:border-zinc-400 bg-white text-zinc-700"
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-zinc-200"
                          />
                          <span className="text-[11px] leading-tight line-clamp-1">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTITY & CORE */}
          {activeTab === "identity" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">
                    Product Master Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nitrile Chemical Barrier Gloves"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">
                    Catalogue SKU Identifier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. VS-PPE-005"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Industrial Sector Category</label>
                  <select
                    value={categoryId}
                    onChange={handleCategoryChange}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-medium"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Unit of Measure (UOM)</label>
                  <input
                    type="text"
                    required
                    value={unitOfMeasure}
                    onChange={(e) => setUnitOfMeasure(e.target.value)}
                    placeholder="piece, pair, box of 100, drum, kg"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. AeroShield Industrial"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Manufacturer Entity</label>
                  <input
                    type="text"
                    value={manufacturerName}
                    onChange={(e) => setManufacturerName(e.target.value)}
                    placeholder="e.g. Diversey Ltd / Pending Verification"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Country of Origin</label>
                  <input
                    type="text"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    placeholder="e.g. India, Germany, USA"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOGISTICS & STOCK */}
          {activeTab === "logistics" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 mb-2">
                <span className="font-bold block mb-1">Inventory & Storage Protocol</span>
                <span>
                  Adjusting stock quantities directly here updates the physical ledger. An automated
                  audit footprint is recorded for compliance inspections.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">
                    Current On-Hand Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 font-bold font-mono text-zinc-950 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Min Reorder Alert Threshold</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Reserved Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={reservedStock}
                    onChange={(e) => setReservedStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Standard Reorder Batch Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={reorderQty}
                    onChange={(e) => setReorderQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">
                    Warehouse Bin / Rack Location Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={locationCode}
                    onChange={(e) => setLocationCode(e.target.value)}
                    placeholder="e.g. WH-MAIN-01 • Zone B-04 / Rack 2"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Facility Name</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Central Logistics Vault"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-100 font-mono text-[11px] text-zinc-700 flex items-center justify-between">
                <span>Calculated Available Stock:</span>
                <span className="font-bold text-zinc-950">
                  {Math.max(0, currentStock - reservedStock)} {unitOfMeasure}s
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM SPECS & DESCRIPTIONS */}
          {activeTab === "specs" && (
            <div className="space-y-5">
              <div>
                <label className="block text-zinc-900 font-bold mb-1">
                  Short Description (Catalogue Card Summary)
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Concise technical summary for rapid scanning..."
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-zinc-900 font-bold mb-1">
                  Full Technical Specification Description
                </label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Detailed engineering breakdown, testing standards, and certifications..."
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-900 font-bold">
                    Critical Limitations & Safety Warnings
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setWarnings("Requires manufacturer SDS/label verification prior to hazardous deployment.")
                    }
                    className="text-[10px] text-amber-700 hover:underline font-semibold"
                  >
                    + Insert Zero-Hallucination Disclaimer
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={warnings}
                  onChange={(e) => setWarnings(e.target.value)}
                  placeholder="Mandatory safety caveats..."
                  className="w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 text-amber-950 text-xs leading-relaxed"
                />
              </div>

              {/* DYNAMIC CUSTOM SPECIFICATIONS BUILDER */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                      <span>Dynamic Technical Specification Attributes</span>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-mono">
                        {customSpecs.length} items
                      </span>
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Add, remove, or customize any technical attribute (tensile strength, standard, thickness, etc.).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => addCustomSpecRow("", "")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-950 text-white text-[11px] font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Specification</span>
                  </button>
                </div>

                {/* Quick chip suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-zinc-400">Quick add:</span>
                  {[
                    "Material",
                    "Thickness / Gauge",
                    "Safety Standard (ANSI/EN)",
                    "Tensile Strength",
                    "Chemical Resistance Rating",
                    "Operating Temperature Range",
                    "Shelf Life",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => addCustomSpecRow(chip, "Pending verification")}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-medium transition-colors"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                {/* Attribute list */}
                <div className="space-y-2 pt-1">
                  {customSpecs.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl border border-dashed border-zinc-200 text-zinc-400 text-xs">
                      No custom specifications added yet. Click &quot;Add Specification&quot; above.
                    </div>
                  ) : (
                    customSpecs.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-200 group hover:border-zinc-300"
                      >
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) => updateCustomSpecRow(index, "key", e.target.value)}
                          placeholder="Spec Name (e.g. Tensile Strength)"
                          className="w-1/3 p-2 rounded-lg border border-zinc-200 bg-white font-semibold text-xs text-zinc-900"
                        />
                        <span className="text-zinc-400 font-mono">:</span>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => updateCustomSpecRow(index, "value", e.target.value)}
                          placeholder="Spec Value (e.g. 18 MPa / EN 374-1:2016)"
                          className="flex-1 p-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-800 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomSpecRow(index)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove this attribute"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRICING & VERIFIED SUPPLIERS */}
          {activeTab === "commercial" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
                <span className="font-bold block mb-1">Non-Store Policy Reminder</span>
                <span>
                  VeriSpec never operates a direct checkout cart or payment gateway. Pricing is
                  indicative reference only, and purchases link directly to authorized external sellers.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">
                    Indicative Catalogue Reference Price (INR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={indicativePriceInr}
                    onChange={(e) => setIndicativePriceInr(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 font-bold font-mono text-zinc-950 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">
                    Verified External Seller Name
                  </label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g. IndiaMART, Moglix, IndustryBuying"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-zinc-900 font-bold mb-1">
                    Direct Supplier Purchase URL
                  </label>
                  <input
                    type="url"
                    value={sellerUrl}
                    onChange={(e) => setSellerUrl(e.target.value)}
                    placeholder="https://www.indiamart.com/prosearch.php?query=safety+respirator"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Seller Price (INR)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={sellerPrice}
                    onChange={(e) => setSellerPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GOVERNANCE & AUDIT */}
          {activeTab === "governance" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-900 font-bold mb-1">
                    Record Lifecycle Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductItem["status"])}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold"
                  >
                    <option value="DRAFT">DRAFT (Unverified)</option>
                    <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                    <option value="ACTIVE">ACTIVE (Published)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                    <option value="DISCONTINUED">DISCONTINUED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-900 font-bold mb-1">Data Confidence Level</label>
                  <select
                    value={dataConfidenceLevel}
                    onChange={(e) =>
                      setDataConfidenceLevel(
                        e.target.value as ProductItem["dataConfidenceLevel"]
                      )
                    }
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold"
                  >
                    <option value="UNVERIFIED">UNVERIFIED</option>
                    <option value="USER_SUBMITTED">USER_SUBMITTED</option>
                    <option value="TRUSTED_SOURCE">TRUSTED_SOURCE</option>
                    <option value="MANUFACTURER_SOURCE">MANUFACTURER_SOURCE</option>
                    <option value="VERIFIED_BY_OWNER">VERIFIED_BY_OWNER</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPubliclyVisible}
                    onChange={(e) => setIsPubliclyVisible(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-900"
                  />
                  <span className="text-zinc-900 font-semibold text-xs">
                    Visible in public search catalogue
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <label className="block text-zinc-900 font-bold mb-1">
                  Mandatory Audit Trail Reason <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  placeholder="Provide justification for this modification (mandatory for compliance)..."
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                />
              </div>
            </div>
          )}

          {/* Footer Action Controls */}
          <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              {productToEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{productToEdit ? "Save Product Master" : "Stage Product Master"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
