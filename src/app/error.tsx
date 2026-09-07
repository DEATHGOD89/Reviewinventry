"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Platform Error caught:", error);
  }, [error]);

  return (
    <div className="pt-36 pb-28 px-6 max-w-md mx-auto text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-700 mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-black text-zinc-950">System Notice</h1>
      <p className="text-xs text-zinc-500 leading-relaxed">
        An error occurred while loading this specification view.
      </p>
      <div className="pt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold hover:bg-zinc-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
