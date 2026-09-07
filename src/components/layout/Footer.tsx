import React from "react";
import Link from "next/link";
import { Shield, ExternalLink, FileText, CheckCircle2, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#0a0a0c] text-zinc-400 overflow-hidden pt-16 pb-12 border-t border-zinc-800/80">
      {/* Huge Background Watermark Text - Visora Style */}
      <div className="absolute -bottom-10 inset-x-0 flex justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden">
        <span className="text-[180px] md:text-[240px] font-black tracking-tighter text-white whitespace-nowrap">
          VERISPEC
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-zinc-850">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-950">
                <Shield className="w-4 h-4 fill-zinc-950" />
              </div>
              <span className="font-bold tracking-tight text-lg">VERISPEC INTEL</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              High-traffic industrial inventory management, trusted product review, and safety compliance platform.
              We provide objective, verified technical specifications with zero fabricated claims.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Audit-Logged Architecture &bull; ISO 4217 Multi-Currency</span>
            </div>
          </div>

          {/* Links 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products" className="hover:text-white transition-colors">Master Catalogue</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Product Comparison</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Auditor Reviews</Link></li>
              <li><Link href="/glossary" className="hover:text-white transition-colors">Safety Standards Glossary</Link></li>
              <li><Link href="/safety" className="hover:text-white transition-colors">Chemical Safety Disclaimers</Link></li>
            </ul>
          </div>

          {/* Links 2: Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Portals & RBAC</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/management" className="hover:text-white transition-colors flex items-center gap-1">Management Portal <Lock className="w-3 h-3 text-zinc-400" /></Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">Owner Admin Portal <Lock className="w-3 h-3 text-amber-500" /></Link></li>
              <li><Link href="/api/health" className="hover:text-white transition-colors">System Health Check</Link></li>
              <li><a href="/templates/product-import-template.csv" download className="hover:text-white transition-colors flex items-center gap-1">Download CSV Templates <FileText className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Links 3: Transparency & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Transparency</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Non-Store Platform Notice</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility Statement</Link></li>
            </ul>
          </div>
        </div>

        {/* Platform Legal Banner */}
        <div className="mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p className="max-w-2xl leading-relaxed">
            <strong className="text-zinc-400">IMPORTANT NOTICE:</strong> VeriSpec is an inventory intelligence and review platform, NOT an online store.
            Users cannot purchase items on this website. All “Buy from external seller” buttons redirect to authorized third-party supplier marketplaces in a new window.
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>&copy; {new Date().getFullYear()} VeriSpec System</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
