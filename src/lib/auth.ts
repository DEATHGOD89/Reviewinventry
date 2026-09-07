import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export type RoleType =
  | "PUBLIC_VISITOR"
  | "REGISTERED_REVIEWER"
  | "MANAGEMENT_STAFF"
  | "MODERATOR"
  | "OWNER_ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: RoleType;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-development-key-only-32-chars-length"
);

const SESSION_COOKIE = "verispec_session";

export async function createSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as RoleType,
    };
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// Server-side authorization guard
export async function assertAuthorized(allowedRoles: RoleType[]): Promise<SessionUser> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Authentication required");
  }
  if (!allowedRoles.includes(session.role)) {
    throw new Error(`FORBIDDEN: Insufficient permissions for role '${session.role}'`);
  }
  return session;
}

// Helper to check credentials against environment variables or database
export async function authenticateCredentials(
  email: string,
  pass: string
): Promise<SessionUser | null> {
  const ownerEmail = (process.env.INITIAL_OWNER_EMAIL || "owner@verispec.local").toLowerCase();
  const ownerPass = process.env.INITIAL_OWNER_PASSWORD || "ChangeMeOnFirstLogin2026!";

  const managerEmail = (process.env.INITIAL_MANAGER_EMAIL || "manager@verispec.local").toLowerCase();
  const managerPass = process.env.INITIAL_MANAGER_PASSWORD || "ManagerAccess2026!";

  const reviewerEmail = (process.env.INITIAL_REVIEWER_EMAIL || "reviewer@verispec.local").toLowerCase();
  const reviewerPass = process.env.INITIAL_REVIEWER_PASSWORD || "ReviewerAccess2026!";

  const normalizedInput = email.toLowerCase().trim();

  if (normalizedInput === ownerEmail && pass === ownerPass) {
    return {
      id: "usr-owner-01",
      email: ownerEmail,
      name: process.env.INITIAL_OWNER_NAME || "System Owner",
      role: "OWNER_ADMIN",
    };
  }

  if (normalizedInput === managerEmail && pass === managerPass) {
    return {
      id: "usr-manager-01",
      email: managerEmail,
      name: process.env.INITIAL_MANAGER_NAME || "Operations Manager",
      role: "MANAGEMENT_STAFF",
    };
  }

  if (normalizedInput === reviewerEmail && pass === reviewerPass) {
    return {
      id: "usr-reviewer-01",
      email: reviewerEmail,
      name: process.env.INITIAL_REVIEWER_NAME || "Field Reviewer",
      role: "REGISTERED_REVIEWER",
    };
  }

  return null;
}
