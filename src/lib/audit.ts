export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValues?: unknown;
  newValues?: unknown;
  reason?: string;
}

// In-memory persistent buffer for high-speed audit log retention
const inMemoryAuditLogs: AuditLogEntry[] = [
  {
    id: "audit-init-01",
    timestamp: new Date().toISOString(),
    userEmail: "system@verispec.local",
    action: "SYSTEM_BOOT",
    entity: "Catalogue",
    entityId: "19-products",
    reason: "Initial catalogue seed with 19 products loaded with unverified placeholders",
    newValues: { count: 19, status: "DRAFT" },
  },
];

export async function logAuditEvent(params: {
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValues?: unknown;
  newValues?: unknown;
  reason?: string;
}): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...params,
  };

  inMemoryAuditLogs.unshift(entry);

  // Structured log output (no secrets)
  console.log(
    `[AUDIT] [${entry.timestamp}] [${entry.action}] [${entry.entity}:${entry.entityId || "N/A"}] by ${
      entry.userEmail || "anonymous"
    } - Reason: ${entry.reason || "None"}`
  );

  return entry;
}

export function getAuditLogs(): AuditLogEntry[] {
  return [...inMemoryAuditLogs];
}
