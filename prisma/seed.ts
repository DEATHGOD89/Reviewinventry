import { PrismaClient, RoleType, ProductStatus, DataConfidenceLevel, DocumentType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting VeriSpec Master Seed...");

  // 1. Initial System Settings & Currency Rates
  await prisma.systemSetting.upsert({
    where: { settingKey: "DEFAULT_CURRENCY" },
    update: {},
    create: {
      settingKey: "DEFAULT_CURRENCY",
      value: process.env.DEFAULT_CURRENCY || "INR",
      description: "Default platform display currency (ISO 4217)",
    },
  });

  await prisma.systemSetting.upsert({
    where: { settingKey: "ALLOWED_PURCHASE_DOMAINS" },
    update: {},
    create: {
      settingKey: "ALLOWED_PURCHASE_DOMAINS",
      value: process.env.ALLOWED_PURCHASE_DOMAINS || "amazon.in,amazon.com,indiamart.com,moglix.com,industrybuying.com,diversey.com",
      description: "Allowlist for external supplier purchase link domains",
    },
  });

  // Indicative exchange rates (Base: INR)
  const exchangeRates = [
    { fromCurrency: "INR", toCurrency: "USD", rate: 0.012000 },
    { fromCurrency: "INR", toCurrency: "EUR", rate: 0.011000 },
    { fromCurrency: "INR", toCurrency: "GBP", rate: 0.009500 },
    { fromCurrency: "INR", toCurrency: "AED", rate: 0.044000 },
  ];

  for (const er of exchangeRates) {
    await prisma.exchangeRate.upsert({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: er.fromCurrency,
          toCurrency: er.toCurrency,
        },
      },
      update: { rate: er.rate, lastFetchedAt: new Date() },
      create: {
        fromCurrency: er.fromCurrency,
        toCurrency: er.toCurrency,
        rate: er.rate,
        provider: "Indicative Static Baseline (Verified source needed for live rates)",
      },
    });
  }

  // 2. Initial Users (Configured via Environment Variables)
  const ownerEmail = process.env.INITIAL_OWNER_EMAIL || "owner@verispec.local";
  const ownerPassword = process.env.INITIAL_OWNER_PASSWORD || "ChangeMeOnFirstLogin2026!";
  const ownerHash = await bcrypt.hash(ownerPassword, 12);

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      name: process.env.INITIAL_OWNER_NAME || "System Administrator",
      passwordHash: ownerHash,
      role: RoleType.OWNER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });

  const managerEmail = process.env.INITIAL_MANAGER_EMAIL || "manager@verispec.local";
  const managerPassword = process.env.INITIAL_MANAGER_PASSWORD || "ManagerAccess2026!";
  const managerHash = await bcrypt.hash(managerPassword, 12);

  await prisma.user.upsert({
    where: { email: managerEmail },
    update: {},
    create: {
      email: managerEmail,
      name: process.env.INITIAL_MANAGER_NAME || "Inventory Manager",
      passwordHash: managerHash,
      role: RoleType.MANAGEMENT_STAFF,
      isEmailVerified: true,
      isActive: true,
    },
  });

  const reviewerEmail = process.env.INITIAL_REVIEWER_EMAIL || "reviewer@verispec.local";
  const reviewerPassword = process.env.INITIAL_REVIEWER_PASSWORD || "ReviewerAccess2026!";
  const reviewerHash = await bcrypt.hash(reviewerPassword, 12);

  await prisma.user.upsert({
    where: { email: reviewerEmail },
    update: {},
    create: {
      email: reviewerEmail,
      name: process.env.INITIAL_REVIEWER_NAME || "Safety Auditor Reviewer",
      passwordHash: reviewerHash,
      role: RoleType.REGISTERED_REVIEWER,
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log("✅ Seeded system settings and initial role accounts from environment config");

  // 3. Categories
  const categoriesData = [
    { name: "Personal Protective Equipment (PPE)", slug: "ppe", description: "Comprehensive body and respiratory protection equipment" },
    { name: "Gloves", slug: "gloves", description: "Hand protection for industrial, chemical, and general purpose handling" },
    { name: "Foot Protection", slug: "foot-protection", description: "Safety footwear, boots, and cleanroom protective shoe covers" },
    { name: "Protective Clothing", slug: "protective-clothing", description: "Lab coats, coveralls, and specialized industrial garments" },
    { name: "Head and Face Protection", slug: "head-face-protection", description: "Hard hats, safety caps, and particulate filtration face masks" },
    { name: "Cleaning Chemicals", slug: "cleaning-chemicals", description: "Industrial heavy-duty detergents, degreasers, and disinfectants" },
    { name: "Hygiene and Sanitization", slug: "hygiene-sanitization", description: "Skin cleansers, hand sanitizers, and washroom essentials" },
    { name: "Waste Management", slug: "waste-management", description: "Industrial waste containment, bins, and heavy-duty refuse bags" },
    { name: "Industrial Supplies", slug: "industrial-supplies", description: "General plant, cleanroom, and maintenance operations supplies" },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }

  // 4. Locations & Warehouses
  const locationsData = [
    { name: "Main Distribution Center", code: "WH-MAIN-01", warehouseName: "Bangalore Logistics Park", aisle: "A-01", shelf: "S-04", bin: "B-12" },
    { name: "Hazardous Chemical Depot", code: "WH-CHEM-02", warehouseName: "Sealed Containment Vault 2", aisle: "C-01", shelf: "S-01", bin: "B-01" },
  ];

  const locationMap = new Map<string, string>();
  for (const loc of locationsData) {
    const record = await prisma.inventoryLocation.upsert({
      where: { code: loc.code },
      update: {},
      create: loc,
    });
    locationMap.set(loc.code, record.id);
  }

  // 5. Initial 19 Products (All seeded strictly as DRAFT / UNVERIFIED)
  // 10 PPE Products
  const ppeProducts = [
    {
      name: "Cap",
      slug: "cap",
      categorySlug: "head-face-protection",
      uom: "piece",
      shortDescription: "Protective cap for head covering and hair containment. Draft record pending owner verification.",
      ppe: {
        protectionType: "Requires verification",
        intendedWorkplace: "Requires verification",
        material: "Requires verification",
        isReusable: false,
        latexFreeStatus: "Requires verification",
        applicableStandards: "Requires manufacturer documentation",
      },
    },
    {
      name: "Mask",
      slug: "mask",
      categorySlug: "head-face-protection",
      uom: "piece",
      shortDescription: "Protective respiratory/face mask. Draft record pending owner verification.",
      ppe: {
        protectionType: "Requires verification",
        intendedWorkplace: "Requires verification",
        material: "Requires verification",
        isReusable: false,
        applicableStandards: "Requires manufacturer documentation",
      },
    },
    {
      name: "Shoe cover",
      slug: "shoe-cover",
      categorySlug: "foot-protection",
      uom: "pair",
      shortDescription: "Protective slip-on shoe cover for clean environments and contamination control.",
      ppe: {
        protectionType: "Requires verification",
        intendedWorkplace: "Requires verification",
        material: "Requires verification",
        isReusable: false,
        applicableStandards: "Requires manufacturer documentation",
      },
    },
    {
      name: "Lab coat",
      slug: "lab-coat",
      categorySlug: "protective-clothing",
      uom: "piece",
      shortDescription: "Protective laboratory garment for personnel. Draft record awaiting fabric and certification details.",
      ppe: {
        protectionType: "Requires verification",
        intendedWorkplace: "Requires verification",
        material: "Requires verification",
        isReusable: true,
        applicableStandards: "Requires manufacturer documentation",
      },
    },
    {
      name: "Nitrile gloves",
      slug: "nitrile-gloves",
      categorySlug: "gloves",
      uom: "box",
      shortDescription: "Synthetic nitrile barrier examination/work gloves. Draft record pending specifications.",
      ppe: {
        protectionType: "Requires verification",
        intendedWorkplace: "Requires verification",
        material: "Nitrile (pending thickness verification)",
        thickness: "Requires verification",
        isPowdered: false,
        latexFreeStatus: "Requires verification",
        applicableStandards: "Requires manufacturer documentation",
      },
    },
    {
      name: "Cotton gloves",
      slug: "cotton-gloves",
      categorySlug: "gloves",
      uom: "pair",
      shortDescription: "Breathable knitted cotton general purpose handling gloves.",
      ppe: {
        protectionType: "Requires verification",
        intendedWorkplace: "Requires verification",
        material: "Cotton",
        isReusable: true,
        applicableStandards: "Requires manufacturer documentation",
      },
    },
    {
      name: "Chemical gloves",
      slug: "chemical-gloves",
      categorySlug: "gloves",
      uom: "pair",
      shortDescription: "Heavy-duty glove engineered for chemical handling. Requires verified SDS/barrier certificate.",
      ppe: {
        protectionType: "Requires manufacturer SDS/label verification",
        intendedWorkplace: "Requires manufacturer SDS/label verification",
        material: "Requires verification",
        thickness: "Requires verification",
        isReusable: true,
        applicableStandards: "Requires manufacturer documentation (e.g. EN ISO 374 pending)",
      },
    },
    {
      name: "Safety shoes",
      slug: "safety-shoes",
      categorySlug: "foot-protection",
      uom: "pair",
      shortDescription: "Protective industrial footwear. Requires verified safety toe and puncture-resistance ratings.",
      ppe: {
        protectionType: "Requires verification",
        intendedWorkplace: "Requires verification",
        material: "Requires verification",
        isReusable: true,
        applicableStandards: "Requires manufacturer documentation (e.g. EN ISO 20345 pending)",
      },
    },
    {
      name: "Black nitrile gloves",
      slug: "black-nitrile-gloves",
      categorySlug: "gloves",
      uom: "box",
      shortDescription: "Black synthetic nitrile gloves for automotive, tattoo, and industrial resistance. Draft record.",
      ppe: {
        protectionType: "Requires verification",
        intendedWorkplace: "Requires verification",
        material: "Nitrile",
        thickness: "Requires verification",
        isPowdered: false,
        latexFreeStatus: "Requires verification",
        applicableStandards: "Requires manufacturer documentation",
      },
    },
    {
      name: "Electrical gloves",
      slug: "electrical-gloves",
      categorySlug: "gloves",
      uom: "pair",
      shortDescription: "Dielectric insulating gloves for electrical utility and maintenance. Strict certification required.",
      ppe: {
        protectionType: "Requires manufacturer SDS/label verification",
        intendedWorkplace: "Requires manufacturer SDS/label verification",
        material: "Requires verification",
        applicableStandards: "Requires manufacturer documentation (voltage class unverified)",
      },
    },
  ];

  // 9 Cleaning, Hygiene, Chemical and Waste Products
  const chemicalAndWasteProducts = [
    {
      name: "Caustic soda",
      slug: "caustic-soda",
      categorySlug: "cleaning-chemicals",
      uom: "kilogram",
      shortDescription: "Industrial chemical compound (Sodium hydroxide). High alkalinity; requires verified manufacturer SDS before use.",
      chemical: {
        productForm: "Solid / Flakes / Pellets (Requires verification)",
        activeIngredients: "Requires manufacturer SDS/label verification",
        dilutionRatio: "Requires manufacturer SDS/label verification",
        phValue: "Requires manufacturer SDS/label verification",
        fragrance: "None",
        hazardClassification: "Requires manufacturer SDS/label verification",
        requiredPpe: "Requires manufacturer SDS/label verification",
        firstAidReference: "Requires manufacturer SDS/label verification",
        storageTemperatureRules: "Store in cool, dry location in airtight containers. Requires manufacturer SDS verification.",
      },
    },
    {
      name: "Divo Flow",
      slug: "divo-flow",
      categorySlug: "cleaning-chemicals",
      uom: "litre",
      shortDescription: "Unverified trademarked product name. Awaiting verified brand, manufacturer, formulation, and documentation from owner.",
      chemical: {
        productForm: "Liquid (Requires verification)",
        activeIngredients: "Requires manufacturer SDS/label verification",
        dilutionRatio: "Requires manufacturer SDS/label verification",
        phValue: "Requires manufacturer SDS/label verification",
        hazardClassification: "Requires manufacturer SDS/label verification",
        requiredPpe: "Requires manufacturer SDS/label verification",
        firstAidReference: "Requires manufacturer SDS/label verification",
      },
    },
    {
      name: "Softcare Plus Sanitizer",
      slug: "softcare-plus-sanitizer",
      categorySlug: "hygiene-sanitization",
      uom: "bottle",
      shortDescription: "Unverified trademarked product name. Awaiting confirmed manufacturer documentation, active antimicrobial agents, and certifications.",
      chemical: {
        productForm: "Liquid / Gel (Requires verification)",
        activeIngredients: "Requires manufacturer SDS/label verification",
        phValue: "Requires manufacturer SDS/label verification",
        hazardClassification: "Requires manufacturer SDS/label verification",
        requiredPpe: "Requires manufacturer SDS/label verification",
        firstAidReference: "Requires manufacturer SDS/label verification",
      },
    },
    {
      name: "Suma Det.",
      slug: "suma-det",
      categorySlug: "cleaning-chemicals",
      uom: "litre",
      shortDescription: "Unverified trademarked detergent product name. Stored as single initial record pending owner formulation verification.",
      chemical: {
        productForm: "Liquid concentrate (Requires verification)",
        activeIngredients: "Requires manufacturer SDS/label verification",
        dilutionRatio: "Requires manufacturer SDS/label verification",
        phValue: "Requires manufacturer SDS/label verification",
        hazardClassification: "Requires manufacturer SDS/label verification",
        requiredPpe: "Requires manufacturer SDS/label verification",
        firstAidReference: "Requires manufacturer SDS/label verification",
      },
    },
    {
      name: "Toilet cleaner",
      slug: "toilet-cleaner",
      categorySlug: "cleaning-chemicals",
      uom: "bottle",
      shortDescription: "Sanitary toilet bowl cleaner and scale remover. Formulation unverified pending SDS submission.",
      chemical: {
        productForm: "Viscous liquid (Requires verification)",
        activeIngredients: "Requires manufacturer SDS/label verification",
        dilutionRatio: "Requires manufacturer SDS/label verification",
        phValue: "Requires manufacturer SDS/label verification",
        hazardClassification: "Requires manufacturer SDS/label verification",
        requiredPpe: "Requires manufacturer SDS/label verification",
        firstAidReference: "Requires manufacturer SDS/label verification",
      },
    },
    {
      name: "Handwash",
      slug: "handwash",
      categorySlug: "hygiene-sanitization",
      uom: "litre",
      shortDescription: "Liquid skin cleansing preparation. Formulation, fragrance, and skin compatibility awaiting verification.",
      chemical: {
        productForm: "Liquid soap (Requires verification)",
        activeIngredients: "Requires manufacturer SDS/label verification",
        phValue: "Requires manufacturer SDS/label verification",
        hazardClassification: "Requires manufacturer SDS/label verification",
        requiredPpe: "Requires manufacturer SDS/label verification",
        firstAidReference: "Requires manufacturer SDS/label verification",
      },
    },
    {
      name: "Suma Breakup",
      slug: "suma-breakup",
      categorySlug: "cleaning-chemicals",
      uom: "litre",
      shortDescription: "Unverified trademarked degreaser product name. Awaiting confirmed manufacturer formulation and safety documentation.",
      chemical: {
        productForm: "Liquid concentrate (Requires verification)",
        activeIngredients: "Requires manufacturer SDS/label verification",
        dilutionRatio: "Requires manufacturer SDS/label verification",
        phValue: "Requires manufacturer SDS/label verification",
        hazardClassification: "Requires manufacturer SDS/label verification",
        requiredPpe: "Requires manufacturer SDS/label verification",
        firstAidReference: "Requires manufacturer SDS/label verification",
      },
    },
    {
      name: "Garbage bags",
      slug: "garbage-bags",
      categorySlug: "waste-management",
      uom: "pack",
      shortDescription: "Refuse and waste disposal bags. Micron thickness, tensile strength, and bio-hazard compatibility pending verification.",
    },
    {
      name: "Dustbin",
      slug: "dustbin",
      categorySlug: "waste-management",
      uom: "piece",
      shortDescription: "Waste containment bin. Volume capacity, pedal mechanism, and polymer grade pending owner verification.",
    },
  ];

  const allInitialProducts = [...ppeProducts, ...chemicalAndWasteProducts];

  console.log(`📦 Seeding exactly ${allInitialProducts.length} initial products (10 PPE + 9 Cleaning/Waste)...`);

  let count = 0;
  for (const item of allInitialProducts) {
    count++;
    const categoryId = categoryMap.get(item.categorySlug) || Array.from(categoryMap.values())[0];
    const sku = `VS-INIT-${String(count).padStart(3, "0")}`;

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        name: item.name,
        slug: item.slug,
        sku: sku,
        categoryId: categoryId,
        unitOfMeasure: item.uom,
        status: ProductStatus.DRAFT,
        dataConfidenceLevel: DataConfidenceLevel.UNVERIFIED,
        shortDescription: item.shortDescription,
        fullDescription: `Full technical specifications, safety data, and supplier credentials for ${item.name} are currently pending owner verification. No claims are published until documented evidence is provided.`,
        limitationsAndWarnings: "Pending documentation: Do not use for hazardous or high-risk applications until manufacturer certification and SDS have been confirmed by management.",
        contentSource: "Initial Seed - Unverified Placeholder",
        isPubliclyVisible: true, // Visible for public review/catalogue indexing with clear "Draft / Unverified" badge
        createdById: owner.id,
      },
    });

    // Create PPE detail if specified
    if ("ppe" in item && item.ppe) {
      await prisma.ppeDetail.upsert({
        where: { productId: product.id },
        update: {},
        create: {
          productId: product.id,
          protectionType: item.ppe.protectionType,
          intendedWorkplace: item.ppe.intendedWorkplace,
          material: item.ppe.material,
          thickness: item.ppe.thickness,
          isReusable: item.ppe.isReusable,
          isPowdered: item.ppe.isPowdered,
          latexFreeStatus: item.ppe.latexFreeStatus || "Requires verification",
          applicableStandards: item.ppe.applicableStandards || "Requires manufacturer documentation",
        },
      });
    }

    // Create Chemical detail if specified
    if ("chemical" in item && item.chemical) {
      await prisma.chemicalDetail.upsert({
        where: { productId: product.id },
        update: {},
        create: {
          productId: product.id,
          productForm: item.chemical.productForm,
          activeIngredients: item.chemical.activeIngredients,
          dilutionRatio: item.chemical.dilutionRatio,
          phValue: item.chemical.phValue,
          fragrance: item.chemical.fragrance,
          hazardClassification: item.chemical.hazardClassification,
          requiredPpe: item.chemical.requiredPpe,
          firstAidReference: item.chemical.firstAidReference,
          storageTemperatureRules: item.chemical.storageTemperatureRules,
        },
      });
    }

    // Create Initial Inventory Balance for warehouse tracking
    const locId = item.categorySlug === "cleaning-chemicals"
      ? locationMap.get("WH-CHEM-02")!
      : locationMap.get("WH-MAIN-01")!;

    await prisma.inventoryBalance.upsert({
      where: {
        productId_locationId_variantId: {
          productId: product.id,
          locationId: locId,
          variantId: "default", // Note: handled or unique constraint
        },
      },
      update: {},
      create: {
        productId: product.id,
        locationId: locId,
        currentStock: 100,
        reservedStock: 10,
        availableStock: 90,
        minStock: 25,
        reorderQty: 100,
      },
    }).catch(async () => {
      // Fallback if variantId null unique constraint is strict in postgres
      await prisma.inventoryBalance.create({
        data: {
          productId: product.id,
          locationId: locId,
          currentStock: 100,
          reservedStock: 10,
          availableStock: 90,
          minStock: 25,
          reorderQty: 100,
        },
      });
    });

    // Create Public Indicative Price Record
    await prisma.publicPriceRecord.create({
      data: {
        productId: product.id,
        indicativePrice: 150.00,
        displayCurrency: "INR",
        isPubliclyVisible: true,
        priceSource: "Reference Benchmark (Indicative only)",
        lastVerifiedAt: new Date(),
      },
    });

    // Seed approved external seller link
    await prisma.externalPurchaseLink.create({
      data: {
        productId: product.id,
        sellerName: "Authorized Safety Supplier",
        externalUrl: "https://www.indiamart.com/prosearch.php?query=" + encodeURIComponent(item.name),
        destinationCountry: "IN",
        currency: "INR",
        priceAmount: 150.00,
        lastCheckedAt: new Date(),
        affiliateDisclosure: "External partner link. VeriSpec does not sell or process payments directly.",
        isAllowed: true,
        isActive: true,
      },
    });

    // Create placeholder initial document requirement
    if (item.categorySlug === "cleaning-chemicals") {
      await prisma.productDocument.create({
        data: {
          productId: product.id,
          documentType: DocumentType.SDS_MSDS,
          title: `Required SDS: ${item.name} (Pending Verification)`,
          fileUrl: "/docs/placeholders/pending-sds.pdf",
          isPublic: false,
          isVerified: false,
        },
      });
    }

    // Immutable audit trail for product initialization
    await prisma.auditLog.create({
      data: {
        userId: owner.id,
        userEmail: owner.email,
        action: "CREATE",
        entity: "Product",
        entityId: product.id,
        reason: "Initial system catalogue draft seed",
        newValuesJson: JSON.stringify({ name: item.name, status: "DRAFT", confidence: "UNVERIFIED" }),
      },
    });
  }

  console.log("🎉 Successfully seeded 19 initial master products with strict verification placeholders!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
