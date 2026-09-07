import { INITIAL_19_PRODUCTS, ProductItem, PRODUCT_IMAGE_MAP } from "../catalog-data";
import { logAuditEvent } from "../audit";

// Extra realistic demo products
export const EXTRA_DEMO_PRODUCTS: ProductItem[] = [
  {
    id: "prod-020",
    name: "Full Face Chemical Respirator",
    slug: "full-face-chemical-respirator",
    sku: "VS-PPE-020",
    categoryId: "cat-5",
    categoryName: "Head and Face Protection",
    categorySlug: "head-face-protection",
    brandName: "AeroShield Industrial (Demo)",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "piece",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Panoramic full-face silicone respirator with dual particulate/organic vapor cartridge ports.",
    fullDescription: "Demo master record. High-impact polycarbonate visor and soft silicone sealing perimeter. Cartridge breakthrough times require official manufacturer documentation.",
    limitationsAndWarnings: "CRITICAL: Must be fit-tested prior to hazardous gas entry. Do not use in oxygen-deficient atmospheres (<19.5% O2).",
    features: ["Silicone inner oronasal cup", "Anti-fog coated wide-view lens", "5-point adjustable head harness"],
    packageIncluded: "Respirator body with storage pouch (filters sold separately)",
    userInstructions: "Perform negative and positive pressure seal checks before entry.",
    storageInstructions: "Store sealed in original pouch away from solvent fumes.",
    disposalInstructions: "Municipal solid waste or decontamination facility.",
    warrantyInfo: "1-year warranty on silicone seal (requires verification).",
    contentSource: "Demo Catalogue Addition",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 3450.0,
    ppeDetail: {
      protectionType: "Respiratory & facial impact barrier",
      intendedWorkplace: "Chemical synthesis plants, pesticide application, paint spray booths",
      material: "Medical grade silicone, polycarbonate visor",
      thickness: "Visor 2.2 mm",
      isReusable: true,
      isSterile: false,
      latexFreeStatus: "Confirmed Latex-Free",
      applicableStandards: "Requires manufacturer documentation (e.g. EN 136 Class 2 / NIOSH pending)",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Safety Equipment Express",
        url: "https://www.moglix.com/safety/respiratory-masks/115160000",
        currency: "INR",
        price: 3450.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 48,
      reservedStock: 6,
      availableStock: 42,
      minStock: 15,
      reorderQty: 50,
    },
    ratingSummary: {
      averageRating: 4.8,
      reviewCount: 6,
      dimensionAverages: { quality: 5, comfort: 4, durability: 5, value: 5, packaging: 4, effectiveness: 5 },
    },
  },
  {
    id: "prod-021",
    name: "Chemical Splash Safety Goggles",
    slug: "chemical-splash-safety-goggles",
    sku: "VS-PPE-021",
    categoryId: "cat-5",
    categoryName: "Head and Face Protection",
    categorySlug: "head-face-protection",
    brandName: "OptiSafe Barrier (Demo)",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "piece",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Indirect-vent liquid splash protective eye goggles with anti-scratch coating.",
    fullDescription: "Demo master record. Engineered with indirect baffle vents to allow airflow while preventing direct chemical droplet penetration.",
    limitationsAndWarnings: "Caution: Do not use for electric arc welding or ionizing radiation protection.",
    features: ["Indirect ventilation vents", "Adjustable neoprene headband", "Fits over prescription spectacles"],
    packageIncluded: "Individual boxed goggle with microfiber wipe",
    userInstructions: "Adjust strap to ensure continuous perimeter seal against facial skin.",
    storageInstructions: "Store in clean drawer away from rough surfaces.",
    disposalInstructions: "Recyclable polymer.",
    warrantyInfo: "6 months manufacturer warranty.",
    contentSource: "Demo Catalogue Addition",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 420.0,
    ppeDetail: {
      protectionType: "Liquid chemical droplet & impact barrier",
      intendedWorkplace: "Wet chemical handling, acid baths, battery rooms",
      material: "Polycarbonate lens, flexible PVC frame",
      isReusable: true,
      isSterile: false,
      latexFreeStatus: "Confirmed Latex-Free",
      applicableStandards: "Requires manufacturer documentation (e.g. EN 166 1.B.3 pending)",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Lab & Safety Supplies",
        url: "https://www.indiamart.com/prosearch.php?query=chemical+splash+goggles",
        currency: "INR",
        price: 420.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 160,
      reservedStock: 20,
      availableStock: 140,
      minStock: 40,
      reorderQty: 150,
    },
    ratingSummary: {
      averageRating: 4.5,
      reviewCount: 4,
      dimensionAverages: { quality: 5, comfort: 4, durability: 4, value: 5, packaging: 4, effectiveness: 5 },
    },
  },
  {
    id: "prod-022",
    name: "Emergency Eyewash & Drench Station",
    slug: "emergency-eyewash-drench-station",
    sku: "VS-IND-022",
    categoryId: "cat-9",
    categoryName: "Industrial Supplies",
    categorySlug: "industrial-supplies",
    brandName: "HydroFlow Safety (Demo)",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "piece",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Wall-mounted dual nozzle emergency eyewash station with push-plate actuator.",
    fullDescription: "Demo master record. Delivers minimum 1.5 litres per minute aerated water flush for 15 continuous minutes. Plumbing connection ANSI Z358.1 compliance pending inspection.",
    limitationsAndWarnings: "CRITICAL: Must be connected to potable water source between 16°C and 38°C. Weekly activation flush required.",
    features: ["Dual aerated spray heads", "High-visibility safety yellow bowl", "Stainless steel push flag handle"],
    packageIncluded: "Eyewash bowl assembly, wall bracket, inspection tag, and ANSI compliance sign",
    userInstructions: "Push flag to activate. Hold eyelids open with fingers and flush for 15 full minutes.",
    storageInstructions: "Installed indoors or frost-protected outdoor utility bays.",
    disposalInstructions: "Scrap stainless steel recycling.",
    warrantyInfo: "3-year mechanical warranty.",
    contentSource: "Demo Catalogue Addition",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 8900.0,
    externalPurchaseLinks: [
      {
        sellerName: "Industrial Safety Systems",
        url: "https://www.industrybuying.com/search/?q=emergency+eyewash+station",
        currency: "INR",
        price: 8900.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 12,
      reservedStock: 2,
      availableStock: 10,
      minStock: 4,
      reorderQty: 10,
    },
    ratingSummary: {
      averageRating: 5.0,
      reviewCount: 3,
      dimensionAverages: { quality: 5, comfort: 5, durability: 5, value: 5, packaging: 5, effectiveness: 5 },
    },
  },
];

// In-memory master store starting with initial 19 + extra demo products
const dynamicProductsStore = new Map<string, ProductItem>();
[...INITIAL_19_PRODUCTS, ...EXTRA_DEMO_PRODUCTS].forEach((p) => {
  if (!p.imageUrl && PRODUCT_IMAGE_MAP[p.slug]) {
    p.imageUrl = PRODUCT_IMAGE_MAP[p.slug].image;
    p.galleryImages = PRODUCT_IMAGE_MAP[p.slug].gallery;
  }
  dynamicProductsStore.set(p.id, JSON.parse(JSON.stringify(p)));
});

export function getAllDynamicProducts(): ProductItem[] {
  return Array.from(dynamicProductsStore.values());
}

export function getDynamicProductBySlug(slug: string): ProductItem | undefined {
  return Array.from(dynamicProductsStore.values()).find((p) => p.slug === slug);
}

export async function createNewProduct(
  data: Partial<ProductItem>,
  userEmail: string
): Promise<ProductItem> {
  const count = dynamicProductsStore.size + 1;
  const id = `prod-${Date.now()}`;
  const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `product-${count}`);
  const sku = data.sku || `VS-DEMO-${String(count).padStart(3, "0")}`;

  const newProduct: ProductItem = {
    id,
    name: data.name || `New Staged Product ${count}`,
    slug,
    sku,
    categoryId: data.categoryId || "cat-1",
    categoryName: data.categoryName || "Personal Protective Equipment (PPE)",
    categorySlug: data.categorySlug || "ppe",
    brandName: data.brandName || "Pending Verification",
    manufacturerName: data.manufacturerName || "Pending Verification",
    countryOfOrigin: data.countryOfOrigin || "Not Provided",
    unitOfMeasure: data.unitOfMeasure || "piece",
    status: data.status || "DRAFT",
    dataConfidenceLevel: data.dataConfidenceLevel || "UNVERIFIED",
    shortDescription: data.shortDescription || "Newly created master product record pending documentation.",
    fullDescription: data.fullDescription || "Technical specifications awaiting owner and manufacturer verification.",
    limitationsAndWarnings: data.limitationsAndWarnings || "Do not use for critical hazards until specifications are documented.",
    features: data.features || ["Pending manufacturer specification"],
    packageIncluded: data.packageIncluded || "Standard packaging",
    userInstructions: data.userInstructions || "Refer to manufacturer technical sheet upon registration.",
    storageInstructions: data.storageInstructions || "Ambient dry storage.",
    disposalInstructions: data.disposalInstructions || "Standard industrial disposal.",
    warrantyInfo: data.warrantyInfo || "Pending owner confirmation.",
    contentSource: `Created by ${userEmail}`,
    sourceUrl: "",
    isPubliclyVisible: data.isPubliclyVisible !== undefined ? data.isPubliclyVisible : true,
    indicativePriceInr: data.indicativePriceInr || 250.0,
    ppeDetail: data.ppeDetail,
    chemicalDetail: data.chemicalDetail,
    externalPurchaseLinks: data.externalPurchaseLinks || [
      {
        sellerName: "Authorized Safety Supplier",
        url: "https://www.indiamart.com/prosearch.php?query=" + encodeURIComponent(data.name || "safety"),
        currency: "INR",
        price: data.indicativePriceInr || 250.0,
        destinationCountry: "IN",
        lastChecked: new Date().toISOString().split("T")[0],
      },
    ],
    inventory: data.inventory || {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 100,
      reservedStock: 10,
      availableStock: 90,
      minStock: 25,
      reorderQty: 100,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  };

  dynamicProductsStore.set(newProduct.id, newProduct);

  await logAuditEvent({
    userEmail,
    action: "PRODUCT_CREATED",
    entity: "Product",
    entityId: newProduct.id,
    newValues: { name: newProduct.name, sku: newProduct.sku, status: newProduct.status },
    reason: `Staff ${userEmail} staged a new master product candidate`,
  });

  return newProduct;
}

export async function updateProductDetails(
  productId: string,
  updates: Partial<ProductItem>,
  userEmail: string,
  customReason?: string
): Promise<ProductItem> {
  const existing = dynamicProductsStore.get(productId);
  if (!existing) {
    throw new Error(`Product with ID '${productId}' not found.`);
  }

  const oldValues = { ...existing };
  const updated = {
    ...existing,
    ...updates,
    inventory: { ...existing.inventory, ...(updates.inventory || {}) },
    ppeDetail: updates.ppeDetail !== undefined ? updates.ppeDetail : existing.ppeDetail,
    chemicalDetail: updates.chemicalDetail !== undefined ? updates.chemicalDetail : existing.chemicalDetail,
  };

  dynamicProductsStore.set(productId, updated);

  await logAuditEvent({
    userEmail,
    action: "PRODUCT_UPDATED",
    entity: "Product",
    entityId: productId,
    oldValues: { name: oldValues.name, status: oldValues.status, price: oldValues.indicativePriceInr },
    newValues: { name: updated.name, status: updated.status, price: updated.indicativePriceInr },
    reason: customReason || `Product specification updated by ${userEmail}`,
  });

  return updated;
}

export async function deleteProductRecord(
  productId: string,
  userEmail: string,
  reason: string
): Promise<boolean> {
  const existing = dynamicProductsStore.get(productId);
  if (!existing) {
    throw new Error(`Product with ID '${productId}' not found.`);
  }

  dynamicProductsStore.delete(productId);

  await logAuditEvent({
    userEmail,
    action: "PRODUCT_DELETED",
    entity: "Product",
    entityId: productId,
    oldValues: { name: existing.name, sku: existing.sku },
    reason: reason || `Product removed by ${userEmail}`,
  });

  return true;
}
