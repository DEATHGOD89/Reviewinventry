import React from "react";

interface BrandLogoProps {
  variant?: "dark" | "light" | "mark";
  className?: string;
  size?: number | string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "dark",
  className = "w-6 h-6",
}) => {
  if (variant === "mark") {
    return (
      <svg
        viewBox="36 45 96 80"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="VeriSpec Logo"
      >
        {/* Left Wing */}
        <polygon points="36,45 48,45 77,97 77,125 56,125 36,89" />
        {/* Right Wing */}
        <polygon points="120,45 132,45 132,89 112,125 91,125 91,97" />
      </svg>
    );
  }

  if (variant === "light") {
    return (
      <div
        className={`rounded-2xl bg-white border border-zinc-200 flex items-center justify-center p-1.5 shadow-2xs ${className}`}
      >
        <svg
          viewBox="36 45 96 80"
          className="w-full h-full text-zinc-950"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="VeriSpec Logo"
        >
          <polygon points="36,45 48,45 77,97 77,125 56,125 36,89" />
          <polygon points="120,45 132,45 132,89 112,125 91,125 91,97" />
        </svg>
      </div>
    );
  }

  // Default: Dark Squircle with White V Mark
  return (
    <div
      className={`rounded-2xl bg-zinc-950 flex items-center justify-center p-1.5 shadow-xs ${className}`}
    >
      <svg
        viewBox="36 45 96 80"
        className="w-full h-full text-white"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="VeriSpec Logo"
      >
        <polygon points="36,45 48,45 77,97 77,125 56,125 36,89" />
        <polygon points="120,45 132,45 132,89 112,125 91,125 91,97" />
      </svg>
    </div>
  );
};
