import { NextResponse } from "next/server";
import { INITIAL_19_PRODUCTS } from "@/lib/catalog-data";
import { getAuditLogs } from "@/lib/audit";

export async function GET() {
  const auditLogs = getAuditLogs();

  return NextResponse.json({
    status: "healthy",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    catalog: {
      initialMasterProductsCount: INITIAL_19_PRODUCTS.length,
      auditLogsRecorded: auditLogs.length,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || "development",
      aiProviderConfigured: Boolean(process.env.AI_PROVIDER_API_KEY),
      defaultCurrency: process.env.DEFAULT_CURRENCY || "INR",
    },
  });
}
