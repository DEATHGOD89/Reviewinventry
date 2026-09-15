"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, ArrowRight, UserCheck, AlertCircle } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role === "OWNER_ADMIN") {
        router.push("/admin");
      } else if (data.user.role === "MANAGEMENT_STAFF") {
        router.push("/management");
      } else {
        router.push("/products");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const setPresetRole = (role: "owner" | "manager" | "reviewer") => {
    if (role === "owner") {
      setEmail("owner@verispec.local");
      setPassword("ChangeMeOnFirstLogin2026!");
    } else if (role === "manager") {
      setEmail("manager@verispec.local");
      setPassword("ManagerAccess2026!");
    } else {
      setEmail("reviewer@verispec.local");
      setPassword("ReviewerAccess2026!");
    }
  };

  return (
    <div className="py-12 px-4 max-w-md mx-auto">
      <div className="rounded-3xl bg-white border border-zinc-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <BrandLogo variant="dark" className="w-14 h-14 rounded-2xl mx-auto shadow-md" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Portal Authentication
          </h1>
          <p className="text-xs text-zinc-500">
            Sign in to access Role-Based Management or Owner controls.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Demo Role Selector Pills */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Select Role Credentials (Configured in .env)
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPresetRole("owner")}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => setPresetRole("manager")}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-200 text-zinc-800 hover:bg-zinc-300 transition-colors"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => setPresetRole("reviewer")}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-200 text-zinc-800 hover:bg-zinc-300 transition-colors"
            >
              Reviewer
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-700 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@verispec.local"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full bg-zinc-950 text-white font-bold text-xs shadow-md hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Verifying..." : "Authenticate & Continue"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
