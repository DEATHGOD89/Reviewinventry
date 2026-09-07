import { NextResponse } from "next/server";
import { clearSessionCookie, getCurrentSession } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST() {
  const session = await getCurrentSession();
  if (session) {
    await logAuditEvent({
      userId: session.id,
      userEmail: session.email,
      action: "USER_LOGOUT",
      entity: "UserSession",
      entityId: session.id,
      reason: "User logged out manually",
    });
  }
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
