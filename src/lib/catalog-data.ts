export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  brandName: string;
  manufacturerName: string;
  countryOfOrigin: string;
  unitOfMeasure: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "DISCONTINUED" | "PENDING_VERIFICATION";
  dataConfidenceLevel: "VERIFIED_BY_OWNER" | "MANUFACTURER_SOURCE" | "TRUSTED_SOURCE" | "USER_SUBMITTED" | "UNVERIFIED";
  shortDescription: string;
  fullDescription: string;
  benefits?: string;
  recommendedUseCases?: string;
  limitationsAndWarnings: string;
  features: string[];
  packageIncluded: string;
  userInstructions: string;
  storageInstructions: string;
  disposalInstructions: string;
  warrantyInfo: string;
  contentSource: string;
  sourceUrl: string;
  imageUrl?: string;
  galleryImages?: string[];
  lastVerifiedAt?: string;
  nextReviewAt?: string;
  isPubliclyVisible: boolean;
  indicativePriceInr: number;
  ppeDetail?: {
    protectionType: string;
    intendedWorkplace: string;
    material: string;
    thickness?: string;
    sizeChart?: string;
    isReusable: boolean;
    isSterile: boolean;
    isPowdered?: boolean;
    latexFreeStatus: string;
    applicableStandards: string;
    careInstructions?: string;
  };
  chemicalDetail?: {
    productForm: string;
    activeIngredients: string;
    dilutionRatio?: string;
    phValue: string;
    fragrance?: string;
    surfaceCompatibility?: string;
    hazardClassification: string;
    requiredPpe: string;
    firstAidReference: string;
    storageTemperatureRules: string;
    sdsVersionDate?: string;
  };
  externalPurchaseLinks: Array<{
    sellerName: string;
    url: string;
    currency: string;
    price: number;
    destinationCountry: string;
    affiliateDisclosure?: string;
    lastChecked: string;
  }>;
  inventory: {
    locationCode: string;
    locationName: string;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    minStock: number;
    reorderQty: number;
  };
  ratingSummary: {
    averageRating: number;
    reviewCount: number;
    dimensionAverages: {
      quality: number;
      comfort: number;
      durability: number;
      value: number;
      packaging: number;
      effectiveness: number;
    };
  };
}

export const INITIAL_CATEGORIES = [
  { id: "cat-1", name: "Personal Protective Equipment (PPE)", slug: "ppe", count: 10 },
  { id: "cat-2", name: "Gloves", slug: "gloves", count: 5 },
  { id: "cat-3", name: "Foot Protection", slug: "foot-protection", count: 2 },
  { id: "cat-4", name: "Protective Clothing", slug: "protective-clothing", count: 1 },
  { id: "cat-5", name: "Head and Face Protection", slug: "head-face-protection", count: 2 },
  { id: "cat-6", name: "Cleaning Chemicals", slug: "cleaning-chemicals", count: 5 },
  { id: "cat-7", name: "Hygiene and Sanitization", slug: "hygiene-sanitization", count: 2 },
  { id: "cat-8", name: "Waste Management", slug: "waste-management", count: 2 },
  { id: "cat-9", name: "Industrial Supplies", slug: "industrial-supplies", count: 0 },
];

export const INITIAL_19_PRODUCTS: ProductItem[] = [
  // 1. Cap
  {
    id: "prod-001",
    name: "Cap",
    slug: "cap",
    sku: "VS-PPE-001",
    categoryId: "cat-5",
    categoryName: "Head and Face Protection",
    categorySlug: "head-face-protection",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "piece",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Protective bouffant/mob cap designed for particulate and hair containment.",
    fullDescription: "Draft master record for industrial head protection cap. Requires manufacturer submission of material weight, elastic headband specifications, and cleanroom compatibility tests.",
    limitationsAndWarnings: "Pending documentation: Not designed for ballistic or impact protection. Do not use near open flames without verified fire-retardant certification.",
    features: ["Lightweight construction (pending spec)", "Elasticated perimeter band", "Unverified breathability rating"],
    packageIncluded: "Pack of 100 caps (pending pack size confirmation)",
    userInstructions: "Ensure all hair is securely gathered and tucked beneath the elastic border before entering controlled areas.",
    storageInstructions: "Store in a cool, dry area away from direct sunlight.",
    disposalInstructions: "Dispose of in designated non-hazardous industrial waste receptacle.",
    warrantyInfo: "Pending manufacturer terms",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 120.0,
    ppeDetail: {
      protectionType: "Particulate containment (Requires verification)",
      intendedWorkplace: "Food processing, pharma, cleanrooms (Pending verification)",
      material: "Polypropylene spunbond (Requires verification)",
      isReusable: false,
      isSterile: false,
      latexFreeStatus: "Requires verification",
      applicableStandards: "Requires manufacturer documentation",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Industrial Safety Mart",
        url: "https://www.indiamart.com/prosearch.php?query=disposable+bouffant+cap",
        currency: "INR",
        price: 120.0,
        destinationCountry: "IN",
        affiliateDisclosure: "External partner link. VeriSpec does not process transactions or earn undisclosed affiliate fees.",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 450,
      reservedStock: 50,
      availableStock: 400,
      minStock: 100,
      reorderQty: 500,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 2. Mask
  {
    id: "prod-002",
    name: "Mask",
    slug: "mask",
    sku: "VS-PPE-002",
    categoryId: "cat-5",
    categoryName: "Head and Face Protection",
    categorySlug: "head-face-protection",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "piece",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Protective particulate and droplet facial barrier mask.",
    fullDescription: "Draft master record for protective mask. Filtration efficiency (e.g. BFE/PFE), ply count, and respiratory classification must be verified against certified lab test reports.",
    limitationsAndWarnings: "Pending documentation: Not confirmed as NIOSH N95, FFP2, or surgical grade without certified test reports.",
    features: ["Multi-layer structure (pending test)", "Nose bridge strip", "Elastic ear loops"],
    packageIncluded: "Box of 50 masks (pending confirmation)",
    userInstructions: "Fit mask tightly over nose and chin. Pinch nose clip to seal bridge.",
    storageInstructions: "Keep in dry, ambient storage away from moisture.",
    disposalInstructions: "Cut earloops and dispose of in bio-hazard or municipal refuse per facility protocol.",
    warrantyInfo: "Single-use hygiene product; no manufacturer warranty.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 250.0,
    ppeDetail: {
      protectionType: "Droplet & dust barrier (Requires verification)",
      intendedWorkplace: "General industrial and hygiene environments",
      material: "Non-woven meltblown / spunbond (Requires verification)",
      isReusable: false,
      isSterile: false,
      latexFreeStatus: "Requires verification",
      applicableStandards: "Requires manufacturer documentation (e.g. EN 14683 / IS 16289 pending)",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Safety Supplies Hub",
        url: "https://www.moglix.com/search?controller=search&s=protective+face+mask",
        currency: "INR",
        price: 250.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 1200,
      reservedStock: 100,
      availableStock: 1100,
      minStock: 200,
      reorderQty: 1000,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 3. Shoe cover
  {
    id: "prod-003",
    name: "Shoe cover",
    slug: "shoe-cover",
    sku: "VS-PPE-003",
    categoryId: "cat-3",
    categoryName: "Foot Protection",
    categorySlug: "foot-protection",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "pair",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Disposable slip-resistant protective overshoe cover.",
    fullDescription: "Draft record for protective shoe covers. Anti-skid sole tread, fluid impermeability, and electrostatic discharge (ESD) status await verified testing documentation.",
    limitationsAndWarnings: "Caution: Do not use on slick icy surfaces or as a substitute for safety-toed footwear.",
    features: ["Elastic closure", "Slip-resistant bottom pattern (unverified)", "One-size-fits-most format"],
    packageIncluded: "Pack of 100 pairs",
    userInstructions: "Stretch over clean work shoes before entering contamination-sensitive cleanroom zones.",
    storageInstructions: "Store sealed in original packaging away from excessive heat.",
    disposalInstructions: "Discard after single transit session.",
    warrantyInfo: "Disposable consumable; no warranty.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 180.0,
    ppeDetail: {
      protectionType: "Contamination transfer prevention (Requires verification)",
      intendedWorkplace: "Pharma, electronic assembly, cleanrooms",
      material: "Chlorinated polyethylene (CPE) or non-woven (Requires verification)",
      isReusable: false,
      isSterile: false,
      latexFreeStatus: "Requires verification",
      applicableStandards: "Requires manufacturer documentation",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Cleanroom Equipment Direct",
        url: "https://www.indiamart.com/prosearch.php?query=disposable+shoe+cover",
        currency: "INR",
        price: 180.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 600,
      reservedStock: 20,
      availableStock: 580,
      minStock: 150,
      reorderQty: 500,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 4. Lab coat
  {
    id: "prod-004",
    name: "Lab coat",
    slug: "lab-coat",
    sku: "VS-PPE-004",
    categoryId: "cat-4",
    categoryName: "Protective Clothing",
    categorySlug: "protective-clothing",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "piece",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Protective laboratory garment with front button/snap closure.",
    fullDescription: "Draft record for protective lab coat. Fabric composition (cotton/poly blend ratio), GSM weight, and chemical splash resistance need laboratory documentation.",
    limitationsAndWarnings: "Warning: Standard lab coats do not protect against concentrated acid deluges or thermal arc flash.",
    features: ["Front button fastening", "Lapel collar", "Two waist pockets and one chest pocket"],
    packageIncluded: "Individual polybag garment",
    userInstructions: "Fasten all buttons completely during handling of biological or chemical samples.",
    storageInstructions: "Hang in ventilated staff lockers.",
    disposalInstructions: "Autoclave or decontaminate prior to textile recycling if exposed to bio-hazards.",
    warrantyInfo: "Requires manufacturer policy verification.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 650.0,
    ppeDetail: {
      protectionType: "Light barrier & clothing protection",
      intendedWorkplace: "Diagnostic, academic, and industrial testing laboratories",
      material: "Polyester / Cotton blend (Requires verification)",
      isReusable: true,
      isSterile: false,
      latexFreeStatus: "Confirmed Latex-Free (Textile)",
      applicableStandards: "Requires manufacturer documentation",
    },
    externalPurchaseLinks: [
      {
        sellerName: "MedLab Supplies",
        url: "https://www.industrybuying.com/search/?q=lab+coat",
        currency: "INR",
        price: 650.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 180,
      reservedStock: 15,
      availableStock: 165,
      minStock: 40,
      reorderQty: 100,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 5. Nitrile gloves
  {
    id: "prod-005",
    name: "Nitrile gloves",
    slug: "nitrile-gloves",
    sku: "VS-PPE-005",
    categoryId: "cat-2",
    categoryName: "Gloves",
    categorySlug: "gloves",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "box",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Synthetic nitrile protective examination gloves (powder-free pending).",
    fullDescription: "Draft master record for blue nitrile gloves. Tensile strength, pinhole AQL level (1.5 / 2.5), and chemical permeation resistance require verified certificates.",
    limitationsAndWarnings: "Warning: Nitrile exhibits poor resistance to highly concentrated ketones and aromatic solvents.",
    features: ["Textured fingertips for enhanced grip", "Beaded cuff", "Ambidextrous fitting"],
    packageIncluded: "Dispenser box of 100 pieces (50 pairs)",
    userInstructions: "Inspect for punctures before donning. Change immediately upon contamination.",
    storageInstructions: "Store below 30°C in dry conditions out of direct UV light.",
    disposalInstructions: "Dispose according to contaminated solid waste regulations.",
    warrantyInfo: "Consumable product.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 450.0,
    ppeDetail: {
      protectionType: "Biological barrier & light chemical resistance (Requires verification)",
      intendedWorkplace: "Healthcare, food service, cleanrooms, precision assembly",
      material: "Acrylonitrile butadiene (Nitrile)",
      thickness: "3.5 to 4.5 mil (Requires verification)",
      isReusable: false,
      isSterile: false,
      isPowdered: false,
      latexFreeStatus: "Requires verification",
      applicableStandards: "Requires manufacturer documentation (e.g. EN 455, EN ISO 374 pending)",
    },
    externalPurchaseLinks: [
      {
        sellerName: "National Safety Corporation",
        url: "https://www.amazon.in/s?k=nitrile+gloves+powder+free",
        currency: "INR",
        price: 450.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 850,
      reservedStock: 120,
      availableStock: 730,
      minStock: 200,
      reorderQty: 800,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 6. Cotton gloves
  {
    id: "prod-006",
    name: "Cotton gloves",
    slug: "cotton-gloves",
    sku: "VS-PPE-006",
    categoryId: "cat-2",
    categoryName: "Gloves",
    categorySlug: "gloves",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "pair",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Breathable knitted cotton general purpose handling gloves.",
    fullDescription: "Draft record for cotton knit inspection and handling gloves. Gauge count, yarn weight, and thermal limits require verification.",
    limitationsAndWarnings: "Warning: Cotton absorbs fluids and provides NO barrier against chemicals, oils, or biological liquids.",
    features: ["Seamless knit construction", "Elastic wrist cuff", "Reversible ambidextrous pattern"],
    packageIncluded: "Bundle of 12 pairs",
    userInstructions: "Use for dry handling and anti-scratch material movement.",
    storageInstructions: "Keep dry in standard warehouse conditions.",
    disposalInstructions: "Municipal solid waste or textile recycling.",
    warrantyInfo: "Consumable product.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 220.0,
    ppeDetail: {
      protectionType: "Abrasion & smudge prevention",
      intendedWorkplace: "Warehousing, parts handling, automotive inspection",
      material: "100% Cotton or Cotton-poly knit (Requires verification)",
      isReusable: true,
      isSterile: false,
      latexFreeStatus: "Latex-Free",
      applicableStandards: "Requires manufacturer documentation",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Industrial Warehouse Store",
        url: "https://www.indiamart.com/prosearch.php?query=cotton+knitted+working+gloves",
        currency: "INR",
        price: 220.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 340,
      reservedStock: 10,
      availableStock: 330,
      minStock: 80,
      reorderQty: 300,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 7. Chemical gloves
  {
    id: "prod-007",
    name: "Chemical gloves",
    slug: "chemical-gloves",
    sku: "VS-PPE-007",
    categoryId: "cat-2",
    categoryName: "Gloves",
    categorySlug: "gloves",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "pair",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Heavy-duty barrier glove engineered for hazardous chemical protection.",
    fullDescription: "Draft record. Requires manufacturer submission of verified chemical permeation breakthrough charts (EN ISO 374-1 Type A/B/C testing). Do not assign protection claims without documented test data.",
    limitationsAndWarnings: "CRITICAL: Do not use with chemicals whose permeation breakthrough time has not been verified against the manufacturer's chemical resistance table.",
    features: ["Extended gauntlet cuff", "Embossed diamond grip pattern", "Flock lined interior (Requires verification)"],
    packageIncluded: "Single pair protective pack",
    userInstructions: "Perform air-inflation test before each use to confirm integrity. Wash exterior before removal.",
    storageInstructions: "Store flat in dark, dry cabinet away from ozone generators.",
    disposalInstructions: "Hazardous waste if contaminated with toxic compounds.",
    warrantyInfo: "Requires manufacturer verification.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 380.0,
    ppeDetail: {
      protectionType: "Requires manufacturer SDS/label verification",
      intendedWorkplace: "Requires manufacturer SDS/label verification",
      material: "Heavy-duty Nitrile / Neoprene / Butyl (Requires verification)",
      thickness: "Requires verification (approx. 15-22 mil unconfirmed)",
      isReusable: true,
      isSterile: false,
      latexFreeStatus: "Requires verification",
      applicableStandards: "Requires manufacturer documentation (e.g. EN 374, EN 388 pending)",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Safety Equip Direct",
        url: "https://www.industrybuying.com/search/?q=chemical+resistant+gloves",
        currency: "INR",
        price: 380.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-CHEM-02",
      locationName: "Hazardous Chemical Depot",
      currentStock: 210,
      reservedStock: 30,
      availableStock: 180,
      minStock: 50,
      reorderQty: 200,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 8. Safety shoes
  {
    id: "prod-008",
    name: "Safety shoes",
    slug: "safety-shoes",
    sku: "VS-PPE-008",
    categoryId: "cat-3",
    categoryName: "Foot Protection",
    categorySlug: "foot-protection",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "pair",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Industrial safety footwear with protective toe cap and slip-resistant outsole.",
    fullDescription: "Draft record for protective footwear. Impact resistance (200 Joule toe rating), midsole puncture plate, oil/fuel resistance, and electrical anti-static properties must be verified via certified BIS/EN test certificates.",
    limitationsAndWarnings: "Warning: Discontinue use immediately if the steel/composite toe cap is exposed or severely impacted.",
    features: ["Protective toe cap (unverified material)", "Padded ankle collar", "Oil-resistant tread (pending lab cert)"],
    packageIncluded: "Shoe box with 1 pair",
    userInstructions: "Ensure proper fit with industrial socks. Fasten laces securely.",
    storageInstructions: "Store in ventilated dry shoe storage.",
    disposalInstructions: "Standard industrial waste.",
    warrantyInfo: "6 months manufacturer sole warranty (requires policy verification).",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 1450.0,
    ppeDetail: {
      protectionType: "Toe impact & sole puncture resistance (Requires verification)",
      intendedWorkplace: "Construction, heavy fabrication, logistics, manufacturing plants",
      material: "Genuine / synthetic leather upper, PU dual-density sole (Requires verification)",
      isReusable: true,
      isSterile: false,
      latexFreeStatus: "Requires verification",
      applicableStandards: "Requires manufacturer documentation (e.g. IS 15298 / EN ISO 20345 S1/S3 pending)",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Workwear Mart",
        url: "https://www.moglix.com/safety/safety-shoes/115160000",
        currency: "INR",
        price: 1450.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 95,
      reservedStock: 12,
      availableStock: 83,
      minStock: 25,
      reorderQty: 80,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 9. Black nitrile gloves
  {
    id: "prod-009",
    name: "Black nitrile gloves",
    slug: "black-nitrile-gloves",
    sku: "VS-PPE-009",
    categoryId: "cat-2",
    categoryName: "Gloves",
    categorySlug: "gloves",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "box",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Heavy-duty black synthetic nitrile gloves for automotive and tactical applications.",
    fullDescription: "Draft record for black nitrile barrier gloves. Mil thickness, fentanyl resistance, and chemical rating require verified test documentation.",
    limitationsAndWarnings: "Caution: Dark color masks biological stains and liquid blood contamination.",
    features: ["Non-glare black finish", "Textured grip surface", "Resistant to grease and motor oils (unverified)"],
    packageIncluded: "Dispenser box of 100 gloves",
    userInstructions: "Inspect for punctures prior to grease or solvent handling.",
    storageInstructions: "Store away from heat and direct sunlight.",
    disposalInstructions: "Dispose with general workshop waste or hazardous bin depending on chemical contact.",
    warrantyInfo: "Consumable product.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 520.0,
    ppeDetail: {
      protectionType: "Heavy duty barrier & light chemical resistance (Requires verification)",
      intendedWorkplace: "Automotive, law enforcement, tattoo studios, mechanical workshops",
      material: "Nitrile",
      thickness: "4.5 to 6.0 mil (Requires verification)",
      isReusable: false,
      isSterile: false,
      isPowdered: false,
      latexFreeStatus: "Requires verification",
      applicableStandards: "Requires manufacturer documentation",
    },
    externalPurchaseLinks: [
      {
        sellerName: "AutoPro Tools & Safety",
        url: "https://www.amazon.in/s?k=black+nitrile+gloves",
        currency: "INR",
        price: 520.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 420,
      reservedStock: 35,
      availableStock: 385,
      minStock: 100,
      reorderQty: 400,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 10. Electrical gloves
  {
    id: "prod-010",
    name: "Electrical gloves",
    slug: "electrical-gloves",
    sku: "VS-PPE-010",
    categoryId: "cat-2",
    categoryName: "Gloves",
    categorySlug: "gloves",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "pair",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Dielectric insulating gloves for energized electrical work.",
    fullDescription: "Draft record for dielectric insulating gloves. Class rating (Class 00, 0, 1, 2, 3, or 4), maximum proof-test voltage, and date of manufacture/re-test cycle must be certified before any live use.",
    limitationsAndWarnings: "CRITICAL DANGER: Never use electrical gloves without verified proof-test certification and recent dielectric test stamps. Periodic re-testing is mandatory.",
    features: ["Dielectric natural or synthetic rubber barrier", "Curved finger ergonomics", "Rolled bead cuff"],
    packageIncluded: "1 pair insulating gloves with protective storage bag (unverified)",
    userInstructions: "Perform visual and pneumatic air leakage inspection before EVERY entry into electrical hazard zone. Wear with leather protectors.",
    storageInstructions: "Store unfolded in designated protective bag away from ozone, heat, and direct light.",
    disposalInstructions: "Destroy and cut upon failing dielectric re-test to prevent accidental re-use.",
    warrantyInfo: "Requires manufacturer verification.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 2800.0,
    ppeDetail: {
      protectionType: "Requires manufacturer SDS/label verification",
      intendedWorkplace: "Requires manufacturer SDS/label verification",
      material: "Dielectric Natural Latex or Synthetic Rubber (Requires verification)",
      thickness: "Voltage class dependent (Requires verification)",
      isReusable: true,
      isSterile: false,
      latexFreeStatus: "Requires verification",
      applicableStandards: "Requires manufacturer documentation (e.g. ASTM D120 / IEC 60903 pending)",
    },
    externalPurchaseLinks: [
      {
        sellerName: "High Voltage Electrical Safety Corp",
        url: "https://www.industrybuying.com/search/?q=electrical+insulating+gloves",
        currency: "INR",
        price: 2800.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 45,
      reservedStock: 5,
      availableStock: 40,
      minStock: 15,
      reorderQty: 50,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 11. Caustic soda
  {
    id: "prod-011",
    name: "Caustic soda",
    slug: "caustic-soda",
    sku: "VS-CHM-011",
    categoryId: "cat-6",
    categoryName: "Cleaning Chemicals",
    categorySlug: "cleaning-chemicals",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "kilogram",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Industrial chemical compound (Sodium Hydroxide). Highly alkaline.",
    fullDescription: "Draft record for industrial caustic soda. All hazard statements, concentration percentages, and PPE requirements require manufacturer SDS verification prior to handling.",
    limitationsAndWarnings: "HAZARD NOTICE: Highly corrosive chemical. Causes severe skin burns and serious eye damage. Reacts violently with acids and water release exothermic heat. Requires manufacturer SDS/label verification.",
    features: ["Strong alkaline agent", "Industrial drain and surface degreasing (Requires verification)", "Flake / pellet format unconfirmed"],
    packageIncluded: "Sealed 25 kg bag / 50 kg drum (pending confirmation)",
    userInstructions: "Always add caustic soda slowly to water, NEVER water to caustic soda. Refer to verified SDS.",
    storageInstructions: "Store tightly sealed in dry, cool location. Keep away from acids, moisture, and aluminum containers.",
    disposalInstructions: "Neutralize according to local environmental chemical regulations under professional oversight.",
    warrantyInfo: "Industrial chemical; no warranty.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 85.0,
    chemicalDetail: {
      productForm: "Solid Flakes / Pellets (Requires verification)",
      activeIngredients: "Requires manufacturer SDS/label verification",
      dilutionRatio: "Requires manufacturer SDS/label verification",
      phValue: "Requires manufacturer SDS/label verification",
      fragrance: "Odorless",
      hazardClassification: "Requires manufacturer SDS/label verification",
      requiredPpe: "Requires manufacturer SDS/label verification",
      firstAidReference: "Requires manufacturer SDS/label verification",
      storageTemperatureRules: "Airtight containment, dry atmosphere. Requires manufacturer SDS verification.",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Chemical Trade Mart",
        url: "https://www.indiamart.com/prosearch.php?query=caustic+soda+flakes",
        currency: "INR",
        price: 85.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-CHEM-02",
      locationName: "Hazardous Chemical Depot",
      currentStock: 1500,
      reservedStock: 200,
      availableStock: 1300,
      minStock: 500,
      reorderQty: 2000,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 12. Divo Flow
  {
    id: "prod-012",
    name: "Divo Flow",
    slug: "divo-flow",
    sku: "VS-CHM-012",
    categoryId: "cat-6",
    categoryName: "Cleaning Chemicals",
    categorySlug: "cleaning-chemicals",
    brandName: "Unverified Trademarked Name",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "litre",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Unverified trademarked product name. Awaiting confirmed brand, manufacturer, formulation, and SDS documentation.",
    fullDescription: "Draft record for Divo Flow. Brand identity, formulation chemistry, active surfactant or enzyme systems, dilution protocol, and official SDS must be confirmed by the owner before publishing.",
    limitationsAndWarnings: "Notice: Trademarked formulation unverified. Do not use or mix with other chemicals until verified manufacturer documentation is registered.",
    features: ["Liquid formulation (Requires verification)", "Pending manufacturer specification"],
    packageIncluded: "5 Litre canister (pending confirmation)",
    userInstructions: "Follow verified manufacturer label instructions once uploaded.",
    storageInstructions: "Keep upright in original container.",
    disposalInstructions: "Awaiting SDS disposal classification.",
    warrantyInfo: "Pending owner confirmation.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 750.0,
    chemicalDetail: {
      productForm: "Liquid (Requires verification)",
      activeIngredients: "Requires manufacturer SDS/label verification",
      dilutionRatio: "Requires manufacturer SDS/label verification",
      phValue: "Requires manufacturer SDS/label verification",
      hazardClassification: "Requires manufacturer SDS/label verification",
      requiredPpe: "Requires manufacturer SDS/label verification",
      firstAidReference: "Requires manufacturer SDS/label verification",
      storageTemperatureRules: "Requires manufacturer SDS/label verification",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Authorized Cleaning Distributor",
        url: "https://www.indiamart.com/prosearch.php?query=divo+flow+cleaner",
        currency: "INR",
        price: 750.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-CHEM-02",
      locationName: "Hazardous Chemical Depot",
      currentStock: 120,
      reservedStock: 10,
      availableStock: 110,
      minStock: 30,
      reorderQty: 100,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 13. Softcare Plus Sanitizer
  {
    id: "prod-013",
    name: "Softcare Plus Sanitizer",
    slug: "softcare-plus-sanitizer",
    sku: "VS-HYG-013",
    categoryId: "cat-7",
    categoryName: "Hygiene and Sanitization",
    categorySlug: "hygiene-sanitization",
    brandName: "Unverified Trademarked Name",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "bottle",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Unverified trademarked sanitizing formulation. Awaiting verified antimicrobial ingredients and documentation.",
    fullDescription: "Draft record for Softcare Plus Sanitizer. Active ingredients, ethanol / isopropanol / chlorhexidine percentage, antimicrobial efficacy test reports, and skin contact approvals must be confirmed by the owner.",
    limitationsAndWarnings: "Notice: No medical or disinfectant claims are made until confirmed laboratory certificates and regulatory licenses are provided.",
    features: ["Topical sanitizing preparation (Requires verification)", "Awaiting confirmed specifications"],
    packageIncluded: "500 ml pump bottle (pending confirmation)",
    userInstructions: "Apply to clean, dry hands. Rub thoroughly until evaporated.",
    storageInstructions: "Store below 25°C away from heat, sparks, and flame.",
    disposalInstructions: "Bottle recyclable when empty.",
    warrantyInfo: "Standard shelf-life terms pending verification.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 180.0,
    chemicalDetail: {
      productForm: "Liquid / Gel (Requires verification)",
      activeIngredients: "Requires manufacturer SDS/label verification",
      dilutionRatio: "Ready to use (Requires verification)",
      phValue: "Requires manufacturer SDS/label verification",
      fragrance: "Requires verification",
      hazardClassification: "Requires manufacturer SDS/label verification",
      requiredPpe: "Requires manufacturer SDS/label verification",
      firstAidReference: "Requires manufacturer SDS/label verification",
      storageTemperatureRules: "Requires manufacturer SDS/label verification",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Hygiene & Care Marketplace",
        url: "https://www.amazon.in/s?k=softcare+plus+sanitizer",
        currency: "INR",
        price: 180.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 350,
      reservedStock: 25,
      availableStock: 325,
      minStock: 80,
      reorderQty: 300,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 14. Suma Det. (Stored only once per instructions)
  {
    id: "prod-014",
    name: "Suma Det.",
    slug: "suma-det",
    sku: "VS-CHM-014",
    categoryId: "cat-6",
    categoryName: "Cleaning Chemicals",
    categorySlug: "cleaning-chemicals",
    brandName: "Unverified Trademarked Name",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "litre",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Unverified trademarked detergent product name. Stored as single record pending owner formulation verification.",
    fullDescription: "Draft record for Suma Det. Appeared twice in initial brief; stored strictly as one initial product master record pending owner confirmation of formulations or pack sizes. SDS and chemical composition pending.",
    limitationsAndWarnings: "Notice: Chemical properties unverified. Awaiting manufacturer SDS submission.",
    features: ["Industrial detergent formulation (Requires verification)", "Pending technical data sheet"],
    packageIncluded: "5 Litre canister (pending confirmation)",
    userInstructions: "Refer to manufacturer technical sheet upon registration.",
    storageInstructions: "Store in original sealed container away from freezing temperatures.",
    disposalInstructions: "Awaiting SDS instructions.",
    warrantyInfo: "Pending owner confirmation.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 620.0,
    chemicalDetail: {
      productForm: "Liquid concentrate (Requires verification)",
      activeIngredients: "Requires manufacturer SDS/label verification",
      dilutionRatio: "Requires manufacturer SDS/label verification",
      phValue: "Requires manufacturer SDS/label verification",
      hazardClassification: "Requires manufacturer SDS/label verification",
      requiredPpe: "Requires manufacturer SDS/label verification",
      firstAidReference: "Requires manufacturer SDS/label verification",
      storageTemperatureRules: "Requires manufacturer SDS/label verification",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Commercial Kitchen Supplies",
        url: "https://www.indiamart.com/prosearch.php?query=suma+det",
        currency: "INR",
        price: 620.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-CHEM-02",
      locationName: "Hazardous Chemical Depot",
      currentStock: 80,
      reservedStock: 10,
      availableStock: 70,
      minStock: 25,
      reorderQty: 80,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 15. Toilet cleaner
  {
    id: "prod-015",
    name: "Toilet cleaner",
    slug: "toilet-cleaner",
    sku: "VS-CHM-015",
    categoryId: "cat-6",
    categoryName: "Cleaning Chemicals",
    categorySlug: "cleaning-chemicals",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "bottle",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Sanitary cleaning and descaling agent for toilet bowls and urinals.",
    fullDescription: "Draft record for toilet cleaner. Active acid or alkaline descaling chemistry, thickener systems, surface compatibility, and SDS must be uploaded before publication.",
    limitationsAndWarnings: "CRITICAL: Do not mix with bleach or chlorine-based sanitizers as toxic chlorine gas may be released. Requires manufacturer SDS/label verification.",
    features: ["Angled nozzle bottle format (unverified)", "Viscous cling formula (unverified)"],
    packageIncluded: "750 ml bottle (pending confirmation)",
    userInstructions: "Apply under rim and leave for 15 minutes before brushing.",
    storageInstructions: "Store upright in secure cabinet away from children.",
    disposalInstructions: "Flush small residues with abundant water; dispose empty bottle according to plastic recycling.",
    warrantyInfo: "Pending manufacturer details.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 110.0,
    chemicalDetail: {
      productForm: "Viscous Liquid (Requires verification)",
      activeIngredients: "Requires manufacturer SDS/label verification",
      dilutionRatio: "Ready to use (Requires verification)",
      phValue: "Requires manufacturer SDS/label verification",
      hazardClassification: "Requires manufacturer SDS/label verification",
      requiredPpe: "Requires manufacturer SDS/label verification",
      firstAidReference: "Requires manufacturer SDS/label verification",
      storageTemperatureRules: "Requires manufacturer SDS/label verification",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Facility Care Superstore",
        url: "https://www.amazon.in/s?k=industrial+toilet+cleaner",
        currency: "INR",
        price: 110.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-CHEM-02",
      locationName: "Hazardous Chemical Depot",
      currentStock: 480,
      reservedStock: 40,
      availableStock: 440,
      minStock: 100,
      reorderQty: 400,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 16. Handwash
  {
    id: "prod-016",
    name: "Handwash",
    slug: "handwash",
    sku: "VS-HYG-016",
    categoryId: "cat-7",
    categoryName: "Hygiene and Sanitization",
    categorySlug: "hygiene-sanitization",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "litre",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Liquid hand soap formulation for washrooms and hygiene stations.",
    fullDescription: "Draft master record for liquid handwash. Surfactant system, moisturizer additives, dermatological patch test reports, and fragrance profile await owner submission.",
    limitationsAndWarnings: "For external skin cleansing only. Avoid contact with eyes. Requires manufacturer SDS/label verification.",
    features: ["Foaming or liquid dispense (Requires verification)", "Skin balanced pH (Requires verification)"],
    packageIncluded: "5 Litre bulk refill container (pending confirmation)",
    userInstructions: "Dispense small quantity on wet hands, lather for 20 seconds, rinse thoroughly.",
    storageInstructions: "Store at room temperature away from direct sunlight.",
    disposalInstructions: "Rinse container prior to HDPE plastic recycling.",
    warrantyInfo: "Requires manufacturer verification.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 320.0,
    chemicalDetail: {
      productForm: "Liquid soap (Requires verification)",
      activeIngredients: "Requires manufacturer SDS/label verification",
      phValue: "Requires manufacturer SDS/label verification",
      fragrance: "Requires verification",
      hazardClassification: "Requires manufacturer SDS/label verification",
      requiredPpe: "Requires manufacturer SDS/label verification",
      firstAidReference: "Requires manufacturer SDS/label verification",
      storageTemperatureRules: "Requires manufacturer SDS/label verification",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Bulk Care Products",
        url: "https://www.indiamart.com/prosearch.php?query=liquid+handwash+5+litre",
        currency: "INR",
        price: 320.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 290,
      reservedStock: 20,
      availableStock: 270,
      minStock: 60,
      reorderQty: 250,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 17. Suma Breakup
  {
    id: "prod-017",
    name: "Suma Breakup",
    slug: "suma-breakup",
    sku: "VS-CHM-017",
    categoryId: "cat-6",
    categoryName: "Cleaning Chemicals",
    categorySlug: "cleaning-chemicals",
    brandName: "Unverified Trademarked Name",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "litre",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Unverified trademarked heavy-duty degreaser product name. Awaiting verified documentation.",
    fullDescription: "Draft record for Suma Breakup. Brand verification, surfactant chemistry, solvent presence, caustic content, and official safety data sheet must be uploaded before publishing confirmed details.",
    limitationsAndWarnings: "Notice: Heavy-duty formulation unverified. Wear chemical resistant gloves and eye protection. Requires manufacturer SDS/label verification.",
    features: ["Heavy grease cutting chemistry (Requires verification)", "Pending technical data sheet"],
    packageIncluded: "5 Litre canister (pending confirmation)",
    userInstructions: "Awaiting confirmed manufacturer instructions.",
    storageInstructions: "Keep tightly capped in a dedicated chemical locker.",
    disposalInstructions: "Awaiting verified SDS guidance.",
    warrantyInfo: "Pending owner confirmation.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 890.0,
    chemicalDetail: {
      productForm: "Liquid concentrate (Requires verification)",
      activeIngredients: "Requires manufacturer SDS/label verification",
      dilutionRatio: "Requires manufacturer SDS/label verification",
      phValue: "Requires manufacturer SDS/label verification",
      hazardClassification: "Requires manufacturer SDS/label verification",
      requiredPpe: "Requires manufacturer SDS/label verification",
      firstAidReference: "Requires manufacturer SDS/label verification",
      storageTemperatureRules: "Requires manufacturer SDS/label verification",
    },
    externalPurchaseLinks: [
      {
        sellerName: "Professional Degreaser Hub",
        url: "https://www.indiamart.com/prosearch.php?query=suma+breakup",
        currency: "INR",
        price: 890.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-CHEM-02",
      locationName: "Hazardous Chemical Depot",
      currentStock: 90,
      reservedStock: 15,
      availableStock: 75,
      minStock: 25,
      reorderQty: 80,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 18. Garbage bags
  {
    id: "prod-018",
    name: "Garbage bags",
    slug: "garbage-bags",
    sku: "VS-WST-018",
    categoryId: "cat-8",
    categoryName: "Waste Management",
    categorySlug: "waste-management",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "pack",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Industrial refuse collection and waste containment bags.",
    fullDescription: "Draft record for garbage bags. Polymer grade (HDPE / LDPE), micron thickness, gusset dimensions, and load capacity require verification before publication.",
    limitationsAndWarnings: "Caution: Do not place exposed sharp needles or hot glass into standard refuse bags. Choking hazard for infants.",
    features: ["Tear resistant bottom seal (Requires verification)", "Black opaque coloring (unverified)"],
    packageIncluded: "Pack of 50 bags (pending confirmation)",
    userInstructions: "Fit into compatible industrial bin with 3-inch overhang.",
    storageInstructions: "Keep in dry location away from rodents and UV sunlight.",
    disposalInstructions: "Municipal landfill or plastic recovery depending on waste stream.",
    warrantyInfo: "Consumable product.",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 210.0,
    externalPurchaseLinks: [
      {
        sellerName: "Packaging & Waste Logistics",
        url: "https://www.amazon.in/s?k=heavy+duty+garbage+bags+black",
        currency: "INR",
        price: 210.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 680,
      reservedStock: 50,
      availableStock: 630,
      minStock: 150,
      reorderQty: 500,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },

  // 19. Dustbin
  {
    id: "prod-019",
    name: "Dustbin",
    slug: "dustbin",
    sku: "VS-WST-019",
    categoryId: "cat-8",
    categoryName: "Waste Management",
    categorySlug: "waste-management",
    brandName: "Pending Verification",
    manufacturerName: "Pending Verification",
    countryOfOrigin: "Not Provided",
    unitOfMeasure: "piece",
    status: "DRAFT",
    dataConfidenceLevel: "UNVERIFIED",
    shortDescription: "Rigid industrial waste container with lid.",
    fullDescription: "Draft master record for industrial dustbin. Litre volume capacity, pedal actuation mechanism, UV resistance rating, and color-coded segregation standards must be documented by owner.",
    limitationsAndWarnings: "Do not place glowing embers or burning materials inside plastic bins.",
    features: ["Heavy gauge molded polymer", "Hygienic foot pedal lid mechanism (Requires verification)", "Smooth interior for rapid washing"],
    packageIncluded: "1 unit waste container with lid assembly",
    userInstructions: "Line with compatible heavy-duty refuse bag before collecting wet waste.",
    storageInstructions: "Ambient warehouse or utility dock.",
    disposalInstructions: "Recyclable bulk polymer (PP / HDPE).",
    warrantyInfo: "1-year structural warranty (requires policy verification).",
    contentSource: "Draft Placeholder - Requires Owner Verification",
    sourceUrl: "",
    isPubliclyVisible: true,
    indicativePriceInr: 950.0,
    externalPurchaseLinks: [
      {
        sellerName: "Industrial Equipment Supply",
        url: "https://www.indiamart.com/prosearch.php?query=industrial+dustbin+pedal",
        currency: "INR",
        price: 950.0,
        destinationCountry: "IN",
        lastChecked: "2026-09-07",
      },
    ],
    inventory: {
      locationCode: "WH-MAIN-01",
      locationName: "Main Distribution Center",
      currentStock: 65,
      reservedStock: 8,
      availableStock: 57,
      minStock: 20,
      reorderQty: 50,
    },
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      dimensionAverages: { quality: 0, comfort: 0, durability: 0, value: 0, packaging: 0, effectiveness: 0 },
    },
  },
];

// High-resolution realistic photography map for industrial products
export const PRODUCT_IMAGE_MAP: Record<string, { image: string; gallery: string[] }> = {
  "cap": {
    image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "mask": {
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586942267865-c3f227a92c4d?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "shoe-cover": {
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "lab-coat": {
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "nitrile-gloves": {
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "cotton-gloves": {
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "chemical-gloves": {
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "safety-shoes": {
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "black-nitrile-gloves": {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "electrical-gloves": {
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "caustic-soda": {
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "divo-flow": {
    image: "https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "softcare-plus-sanitizer": {
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "suma-det": {
    image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "toilet-cleaner": {
    image: "https://images.unsplash.com/photo-1585670213985-076def755770?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585670213985-076def755770?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "handwash": {
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "suma-breakup": {
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "garbage-bags": {
    image: "https://images.unsplash.com/photo-1610492494488-812e9b88cf1e?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1610492494488-812e9b88cf1e?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "dustbin": {
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "full-face-chemical-respirator": {
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "chemical-splash-safety-goggles": {
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "emergency-eyewash-drench-station": {
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    ],
  },
};

// Hydrate initial products with realistic photography
INITIAL_19_PRODUCTS.forEach((p) => {
  const match = PRODUCT_IMAGE_MAP[p.slug];
  if (match) {
    p.imageUrl = match.image;
    p.galleryImages = match.gallery;
  }
});

