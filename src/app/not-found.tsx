import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-36 pb-28 px-6 max-w-md mx-auto text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h1 className="text-4xl font-black text-zinc-950">404</h1>
      <h2 className="text-base font-bold text-zinc-800">Master Record Not Found</h2>
      <p className="text-xs text-zinc-500 leading-relaxed">
        The requested product, specification, or category could not be located in our registry.
      </p>
      <div className="pt-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Master Catalogue</span>
        </Link>
      </div>
    </div>
  );
}
