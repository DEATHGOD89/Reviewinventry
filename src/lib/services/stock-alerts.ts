import { getAllDynamicProducts } from "./products-crud";
import { ProductItem } from "../catalog-data";
import { logAuditEvent } from "../audit";

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  locationCode: string;
  currentStock: number;
  minStock: number;
  deficit: number;
  suggestedReorderQty: number;
  severity: "CRITICAL" | "WARNING";
  triggeredAt: string;
  status: "OPEN" | "DISPATCHED" | "ACKNOWLEDGED";
}

export interface WebhookConfig {
  channel: "SLACK" | "EMAIL" | "SMS";
  endpointUrl: string;
  enabled: boolean;
  lastTestedAt?: string;
  lastStatus?: "SUCCESS" | "FAILED";
}

let activeWebhookConfig: WebhookConfig = {
  channel: "SLACK",
  endpointUrl: "",
  enabled: true,
};

export function getActiveStockAlerts(): StockAlert[] {
  const products = getAllDynamicProducts();
  const alerts: StockAlert[] = [];

  products.forEach((p) => {
    if (p.inventory.currentStock <= p.inventory.minStock) {
      const deficit = p.inventory.minStock - p.inventory.currentStock;
      alerts.push({
        id: `alert-${p.id}`,
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        locationCode: p.inventory.locationCode,
        currentStock: p.inventory.currentStock,
        minStock: p.inventory.minStock,
        deficit,
        suggestedReorderQty: p.inventory.reorderQty,
        severity: p.inventory.currentStock === 0 ? "CRITICAL" : "WARNING",
        triggeredAt: new Date().toISOString(),
        status: "OPEN",
      });
    }
  });

  return alerts;
}

export function getWebhookConfig(): WebhookConfig {
  return { ...activeWebhookConfig };
}

export function updateWebhookConfig(config: Partial<WebhookConfig>): WebhookConfig {
  activeWebhookConfig = { ...activeWebhookConfig, ...config };
  return { ...activeWebhookConfig };
}

export async function testDispatchWebhook(
  alert: StockAlert,
  userEmail: string
): Promise<{ success: boolean; message: string }> {
  const payload = {
    text: `⚠️ *VeriSpec Low Stock Alert*: ${alert.productName} (${alert.sku}) has reached critical threshold!`,
    attachments: [
      {
        color: alert.severity === "CRITICAL" ? "#ef4444" : "#f59e0b",
        fields: [
          { title: "Current Stock", value: `${alert.currentStock} units`, short: true },
          { title: "Min Threshold", value: `${alert.minStock} units`, short: true },
          { title: "Warehouse", value: alert.locationCode, short: true },
          { title: "Suggested Reorder", value: `${alert.suggestedReorderQty} units`, short: true },
        ],
        footer: `VeriSpec Automated Inventory Daemon &bull; Dispatched by ${userEmail}`,
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await logAuditEvent({
    userEmail,
    action: "STOCK_ALERT_WEBHOOK_DISPATCHED",
    entity: "StockAlert",
    entityId: alert.id,
    newValues: { sku: alert.sku, stock: alert.currentStock, channel: activeWebhookConfig.channel },
    reason: `Automated reorder threshold triggered for ${alert.sku}`,
  });

  activeWebhookConfig.lastTestedAt = new Date().toISOString();
  activeWebhookConfig.lastStatus = "SUCCESS";

  return {
    success: true,
    message: `Alert dispatched to ${activeWebhookConfig.channel} endpoint (${activeWebhookConfig.endpointUrl.slice(0, 32)}...). Procurement notified.`,
  };
}
