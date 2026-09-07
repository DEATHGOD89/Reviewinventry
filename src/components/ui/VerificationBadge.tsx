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

export interface AuditorBadgeProps {
  role?: string;
  registrationNumber?: string;
  className?: string;
}

export const AuditorBadge: React.FC<AuditorBadgeProps> = ({
  role = "Certified Safety Auditor",
  registrationNumber,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs ${className}`}
      title={registrationNumber ? `Verified Credentials: ${registrationNumber}` : "Certified Industry Auditor"}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
      <span>{role}</span>
      {registrationNumber && (
        <span className="font-mono text-[9px] px-1 py-0.2 bg-amber-200 rounded text-amber-950 font-normal">
          {registrationNumber}
        </span>
      )}
    </span>
  );
};
