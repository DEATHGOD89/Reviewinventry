import { logAuditEvent } from "../audit";
import { INITIAL_19_PRODUCTS, ProductItem } from "../catalog-data";

export interface StockMovementRecord {
  id: string;
  productId: string;
  productName: string;
  movementType: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "TRANSFER" | "DAMAGE" | "RETURN" | "EXPIRY";
  quantity: number;
  previousStock: number;
  newStock: number;
  mandatoryReason: string;
  locationCode: string;
  timestamp: string;
  createdByUser: string;
}

// In-memory stock balance state starting with initial 19 products
const stockItems = new Map<string, ProductItem>();
INITIAL_19_PRODUCTS.forEach((p) => stockItems.set(p.id, JSON.parse(JSON.stringify(p))));

const stockMovements: StockMovementRecord[] = [
  {
    id: "mov-init-01",
    productId: "prod-001",
    productName: "Cap",
    movementType: "STOCK_IN",
    quantity: 450,
    previousStock: 0,
    newStock: 450,
    mandatoryReason: "Initial baseline warehouse intake",
    locationCode: "WH-MAIN-01",
    timestamp: new Date().toISOString(),
    createdByUser: "System Seed",
  },
  {
    id: "mov-init-02",
    productId: "prod-011",
    productName: "Caustic soda",
    movementType: "STOCK_IN",
    quantity: 1500,
    previousStock: 0,
    newStock: 1500,
    mandatoryReason: "Initial chemical storage intake",
    locationCode: "WH-CHEM-02",
    timestamp: new Date().toISOString(),
    createdByUser: "System Seed",
  },
];

export function getProductStockList(): ProductItem[] {
  return Array.from(stockItems.values());
}

export function getStockMovements(): StockMovementRecord[] {
  return [...stockMovements];
}

export async function recordInventoryAdjustment(params: {
  productId: string;
  movementType: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "TRANSFER" | "DAMAGE" | "RETURN" | "EXPIRY";
  quantity: number; // positive integer
  mandatoryReason: string;
  userEmail: string;
}): Promise<{ success: boolean; newStock: number; message: string }> {
  const item = stockItems.get(params.productId);
  if (!item) {
    throw new Error(`Product with ID '${params.productId}' not found.`);
  }

  if (!params.mandatoryReason || params.mandatoryReason.trim().length < 5) {
    throw new Error("MANDATORY_REASON_REQUIRED: A descriptive reason of at least 5 characters is strictly required for stock adjustments.");
  }

  const prevStock = item.inventory.currentStock;
  let newStock = prevStock;

  if (params.movementType === "STOCK_IN" || params.movementType === "RETURN") {
    newStock = prevStock + Math.abs(params.quantity);
  } else {
    // STOCK_OUT, ADJUSTMENT (down), DAMAGE, EXPIRY
    if (prevStock < Math.abs(params.quantity)) {
      throw new Error(`INSUFFICIENT_STOCK: Current stock is ${prevStock}, cannot deduct ${Math.abs(params.quantity)}.`);
    }
    newStock = prevStock - Math.abs(params.quantity);
  }

  item.inventory.currentStock = newStock;
  item.inventory.availableStock = Math.max(0, newStock - item.inventory.reservedStock);

  const movementRecord: StockMovementRecord = {
    id: `mov-${Date.now()}`,
    productId: item.id,
    productName: item.name,
    movementType: params.movementType,
    quantity: params.quantity,
    previousStock: prevStock,
    newStock: newStock,
    mandatoryReason: params.mandatoryReason,
    locationCode: item.inventory.locationCode,
    timestamp: new Date().toISOString(),
    createdByUser: params.userEmail,
  };

  stockMovements.unshift(movementRecord);

  // Immutable audit log
  await logAuditEvent({
    userEmail: params.userEmail,
    action: `STOCK_${params.movementType}`,
    entity: "InventoryBalance",
    entityId: item.id,
    oldValues: { stock: prevStock },
    newValues: { stock: newStock, movement: params.movementType, qty: params.quantity },
    reason: params.mandatoryReason,
  });

  return {
    success: true,
    newStock,
    message: `Stock updated for ${item.name}. Previous: ${prevStock}, Current: ${newStock}.`,
  };
}

export function getInventoryKpis() {
  const products = Array.from(stockItems.values());
  const totalProducts = products.length;
  const draftPending = products.filter((p) => p.status === "DRAFT" || p.status === "PENDING_VERIFICATION").length;
  const lowStock = products.filter((p) => p.inventory.currentStock <= p.inventory.minStock).length;
  const totalUnits = products.reduce((acc, p) => acc + p.inventory.currentStock, 0);
  const totalStockValueInr = products.reduce((acc, p) => acc + p.inventory.currentStock * p.indicativePriceInr, 0);

  return {
    totalProducts,
    draftPending,
    lowStock,
    totalUnits,
    totalStockValueInr,
  };
}
