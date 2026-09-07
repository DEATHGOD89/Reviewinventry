"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Search, SlidersHorizontal, User, Menu, X, ArrowUpRight } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catalogue", href: "/products" },
    { name: "Compare", href: "/compare" },
    { name: "Reviews", href: "/reviews" },
    { name: "Glossary", href: "/glossary" },
    { name: "Safety Info", href: "/safety" },
  ];

  return (
    <>
      <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-6xl pointer-events-auto flex items-center justify-between">
          {/* Brand Logo - Visora style */}
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/85 backdrop-blur-md border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-white">
              <Shield className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-bold tracking-tight text-sm text-zinc-950">VERISPEC</span>
            <span className="text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-semibold">
              INTEL
            </span>
          </Link>

          {/* Centered Pill Nav */}
          <nav className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-zinc-200/90 shadow-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Portal Access */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-white shadow-xs transition-colors"
              title="Search catalogue"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/compare"
              className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-white shadow-xs transition-colors hidden sm:flex"
              title="Compare Products"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Link>

            <Link
              href="/management"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold shadow-xs hover:bg-zinc-800 transition-all group"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portals</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-zinc-200 text-zinc-900 md:hidden shadow-xs"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-20 inset-x-4 max-w-sm mx-auto p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-2xl pointer-events-auto flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                  pathname === link.href ? "bg-zinc-900 text-white" : "text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-zinc-100 flex flex-col gap-1.5">
              <Link
                href="/management"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-900 flex justify-between items-center"
              >
                <span>Management Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-950 text-white flex justify-between items-center"
              >
                <span>Owner Admin Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div
            className="fixed inset-0"
            onClick={() => setSearchModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 p-5 overflow-hidden z-10">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
              <Search className="w-5 h-5 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search PPE, chemicals, safety shoes, gloves, standards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery) {
                    window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="w-full text-sm outline-none bg-transparent placeholder-zinc-400 text-zinc-900"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-500 hover:text-zinc-800"
              >
                ESC
              </button>
            </div>

            <div className="pt-4">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Quick Category Shortcuts
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Nitrile gloves",
                  "Caustic soda",
                  "Chemical gloves",
                  "Safety shoes",
                  "Mask",
                  "Divo Flow",
                  "Toilet cleaner",
                ].map((item) => (
                  <Link
                    key={item}
                    href={`/products?q=${encodeURIComponent(item)}`}
                    onClick={() => setSearchModalOpen(false)}
                    className="px-3 py-1.5 rounded-full bg-zinc-100 text-xs font-medium text-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
