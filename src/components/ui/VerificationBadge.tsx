import React from "react";
import { ShieldAlert, ShieldCheck, Clock, AlertTriangle } from "lucide-react";

export interface VerificationBadgeProps {
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "DISCONTINUED" | "PENDING_VERIFICATION";
  confidence?: "VERIFIED_BY_OWNER" | "MANUFACTURER_SOURCE" | "TRUSTED_SOURCE" | "USER_SUBMITTED" | "UNVERIFIED";
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  confidence = "UNVERIFIED",
  className = "",
}) => {
  if (confidence === "VERIFIED_BY_OWNER" || confidence === "MANUFACTURER_SOURCE") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Verified Information
      </span>
    );
  }

  if (status === "DRAFT" || confidence === "UNVERIFIED") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/80 ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Pending Owner Verification
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-750 border border-zinc-200 ${className}`}
    >
      <Clock className="w-3.5 h-3.5 text-zinc-500" />
      {status}
    </span>
  );
};
