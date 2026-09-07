import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { INITIAL_19_PRODUCTS } from "../src/lib/catalog-data.js";
import { convertFromInr, INDICATIVE_PRICE_DISCLAIMER } from "../src/lib/services/currency.js";
import { recordInventoryAdjustment, getProductStockList } from "../src/lib/services/inventory.js";
import { submitNewReview, moderateReview, getAllReviewsForModeration } from "../src/lib/services/reviews.js";

describe("VeriSpec Master Catalog Integrity Tests", () => {
  test("Catalog contains exactly 19 initial master products (10 PPE + 9 Cleaning/Waste)", () => {
    assert.equal(INITIAL_19_PRODUCTS.length, 19, "Must have exactly 19 initial products");
  });

  test("All initial 19 products are seeded as DRAFT and UNVERIFIED with zero fabricated claims", () => {
    for (const p of INITIAL_19_PRODUCTS) {
      assert.equal(p.status, "DRAFT", `${p.name} must be DRAFT status`);
      assert.equal(p.dataConfidenceLevel, "UNVERIFIED", `${p.name} must be UNVERIFIED`);
    }
  });

  test("Caustic soda chemical properties are marked 'Requires manufacturer SDS/label verification'", () => {
    const caustic = INITIAL_19_PRODUCTS.find((p) => p.slug === "caustic-soda");
    assert.ok(caustic, "Caustic soda must exist");
    assert.ok(caustic.chemicalDetail, "Caustic soda must have chemicalDetail");
    assert.equal(
      caustic.chemicalDetail.activeIngredients,
      "Requires manufacturer SDS/label verification"
    );
    assert.equal(
      caustic.chemicalDetail.hazardClassification,
      "Requires manufacturer SDS/label verification"
    );
    assert.equal(
      caustic.chemicalDetail.requiredPpe,
      "Requires manufacturer SDS/label verification"
    );
  });

  test("Suma Det. is stored strictly as a single record", () => {
    const sumaDetList = INITIAL_19_PRODUCTS.filter((p) => p.slug === "suma-det" || p.name === "Suma Det.");
    assert.equal(sumaDetList.length, 1, "Suma Det. must only have 1 product master record");
  });
});

describe("Currency & Indicative Pricing Tests", () => {
  test("Converts INR to USD with indicative disclaimer", () => {
    const res = convertFromInr(1000, "USD");
    assert.equal(res.amount, 12.0); // 1000 * 0.012
    assert.ok(res.formatted.includes("$12.00"));
    assert.equal(res.disclaimer, INDICATIVE_PRICE_DISCLAIMER);
  });

  test("Returns exact INR formatted for base currency", () => {
    const res = convertFromInr(500, "INR");
    assert.equal(res.amount, 500);
    assert.ok(res.formatted.includes("₹500.00"));
  });
});

describe("Inventory Operations & Mandatory Reason Enforcement", () => {
  test("Stock adjustment throws if mandatory reason is missing or shorter than 5 chars", async () => {
    await assert.rejects(
      async () => {
        await recordInventoryAdjustment({
          productId: "prod-001",
          movementType: "ADJUSTMENT",
          quantity: 5,
          mandatoryReason: "bad", // too short (< 5 chars)
          userEmail: "manager@verispec.local",
        });
      },
      {
        message: /MANDATORY_REASON_REQUIRED/,
      }
    );
  });

  test("Stock adjustment succeeds with valid reason and updates inventory", async () => {
    const items = getProductStockList();
    const item = items.find((p) => p.id === "prod-001");
    assert.ok(item);
    const initialStock = item.inventory.currentStock;

    const res = await recordInventoryAdjustment({
      productId: "prod-001",
      movementType: "STOCK_IN",
      quantity: 50,
      mandatoryReason: "Supplier consignment delivery verified by warehouse lead",
      userEmail: "manager@verispec.local",
    });

    assert.equal(res.success, true);
    assert.equal(res.newStock, initialStock + 50);
  });
});

describe("Review Moderation & Anti-Spam Workflow", () => {
  test("Newly submitted review starts in PENDING status", async () => {
    const submission = await submitNewReview({
      productId: "prod-001",
      productName: "Cap",
      reviewerName: "Test Auditor",
      reviewerEmail: "auditor@test.com",
      rating: 4,
      title: "Cleanroom trial feedback",
      content: "Detailed evaluation of elastic band tension during 8 hour cleanroom shift.",
    });

    assert.equal(submission.success, true);
    assert.equal(submission.review.status, "PENDING");
  });

  test("Review rejection preserves rejection reason", async () => {
    const reviews = getAllReviewsForModeration();
    const pending = reviews.find((r) => r.status === "PENDING");
    assert.ok(pending);

    const res = await moderateReview({
      reviewId: pending.id,
      status: "REJECTED",
      rejectionReason: "Insufficient technical documentation provided",
      moderatorEmail: "manager@verispec.local",
    });

    assert.equal(res.success, true);
    assert.equal(pending.status, "REJECTED");
    assert.equal(pending.rejectionReason, "Insufficient technical documentation provided");
  });
});
