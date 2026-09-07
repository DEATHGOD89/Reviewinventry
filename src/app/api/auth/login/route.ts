import { NextResponse } from "next/server";
import { authenticateCredentials, setSessionCookie } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await authenticateCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email and password." },
        { status: 401 }
      );
    }

    await setSessionCookie(user);

    await logAuditEvent({
      userId: user.id,
      userEmail: user.email,
      action: "USER_LOGIN",
      entity: "UserSession",
      entityId: user.id,
      reason: `Successful authentication with role: ${user.role}`,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Authentication error" },
      { status: 500 }
    );
  }
}
