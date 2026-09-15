import React from "react";
import Link from "next/link";
import { Shield, ExternalLink, FileText, CheckCircle2, Lock } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white text-slate-600 overflow-hidden pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                VS
              </div>
              <span className="font-extrabold tracking-tight text-lg text-slate-900">VERISPEC INTEL</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              High-traffic industrial inventory intelligence, trusted product review, and safety compliance platform.
              We provide objective, verified technical specifications with zero fabricated claims.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Audit-Logged Architecture &bull; ISO 4217 Multi-Currency</span>
            </div>
          </div>

          {/* Links 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products" className="text-slate-600 hover:text-indigo-600 transition-colors">Master Catalogue</Link></li>
              <li><Link href="/compare" className="text-slate-600 hover:text-indigo-600 transition-colors">Product Comparison</Link></li>
              <li><Link href="/reviews" className="text-slate-600 hover:text-indigo-600 transition-colors">Auditor Reviews</Link></li>
              <li><Link href="/glossary" className="text-slate-600 hover:text-indigo-600 transition-colors">Safety Standards Glossary</Link></li>
              <li><Link href="/safety" className="text-slate-600 hover:text-indigo-600 transition-colors">Chemical Safety Disclaimers</Link></li>
            </ul>
          </div>

          {/* Links 2: Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Portals & RBAC</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/management" className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">Management Portal <Lock className="w-3 h-3 text-slate-400" /></Link></li>
              <li><Link href="/admin" className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">Owner Admin Portal <Lock className="w-3 h-3 text-amber-500" /></Link></li>
              <li><Link href="/api/health" className="text-slate-600 hover:text-indigo-600 transition-colors">System Health Check</Link></li>
              <li><a href="/templates/product-import-template.csv" download className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">Download CSV Templates <FileText className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Links 3: Transparency & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Transparency</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/disclaimer" className="text-slate-600 hover:text-indigo-600 transition-colors">Non-Store Platform Notice</Link></li>
              <li><Link href="/privacy" className="text-slate-600 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-600 hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/accessibility" className="text-slate-600 hover:text-indigo-600 transition-colors">Accessibility Statement</Link></li>
            </ul>
          </div>
        </div>

        {/* Platform Legal Banner */}
        <div className="mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="max-w-2xl leading-relaxed">
            <strong className="text-slate-800">IMPORTANT NOTICE:</strong> VeriSpec is an inventory intelligence and review platform, NOT an online store.
            Users cannot purchase items on this website. All &ldquo;Buy from external seller&rdquo; buttons redirect to authorized third-party supplier marketplaces in a new window.
          </p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>&copy; {new Date().getFullYear()} VeriSpec Intel</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
