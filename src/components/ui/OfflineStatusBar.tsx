"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, ShieldCheck } from "lucide-react";

export const OfflineStatusBar: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Register service worker if supported
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("[VeriSpec PWA] Service worker registered."))
        .catch((err) => console.log("[VeriSpec PWA] SW registration failed:", err));
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs font-semibold shadow-xl border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 transition-all ${
        isOnline
          ? "bg-emerald-950 text-emerald-200 border-emerald-500/40"
          : "bg-amber-950 text-amber-200 border-amber-500/50"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>Online &bull; Central Telemetry Synchronized</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Offline Inspection Mode &bull; Cached Master Records Active</span>
        </>
      )}
    </div>
  );
};
