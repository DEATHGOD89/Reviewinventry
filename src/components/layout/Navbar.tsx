"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Search, SlidersHorizontal, User, Menu, X, ArrowUpRight, ArrowRight, Package, ChevronDown, Lock, Settings } from "lucide-react";
import { getAllDynamicProducts } from "@/lib/services/products-crud";
import { ProductItem } from "@/lib/catalog-data";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const portalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAllProducts(getAllDynamicProducts());

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (portalRef.current && !portalRef.current.contains(e.target as Node)) {
        setPortalMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/85 backdrop-blur-md border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-white shadow-xs transition-colors"
              title="Search catalogue (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs text-zinc-400">Search</span>
              <kbd className="hidden lg:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/compare"
              className="p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-white shadow-xs transition-colors hidden sm:flex"
              title="Compare Products"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Link>

            {/* Desktop Portals Dropdown */}
            <div className="relative hidden md:block" ref={portalRef}>
              <button
                type="button"
                onClick={() => setPortalMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold shadow-xs hover:bg-zinc-850 transition-all group"
              >
                <User className="w-3.5 h-3.5 text-zinc-300" />
                <span>Portals</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                    portalMenuOpen ? "rotate-180 text-white" : "group-hover:translate-y-0.5"
                  }`}
                />
              </button>

              {portalMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-zinc-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Access Portals & Control
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      RBAC Active
                    </span>
                  </div>

                  <div className="py-1 space-y-1">
                    <Link
                      href="/management"
                      onClick={() => setPortalMenuOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-100 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white flex items-center justify-center text-zinc-800 transition-colors shrink-0 mt-0.5">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900 group-hover:text-zinc-950">
                            Management Portal
                          </span>
                          <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                            Staff
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Stock adjustments, QR shelf labels & movements
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setPortalMenuOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-100 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center text-amber-700 transition-colors shrink-0 mt-0.5">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900 group-hover:text-zinc-950">
                            Owner Admin Portal
                          </span>
                          <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-semibold">
                            Owner
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Governance, AI model keys, catalogue master & audits
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setPortalMenuOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-100 transition-colors group border-t border-zinc-100 pt-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-zinc-800 group-hover:text-white flex items-center justify-center text-zinc-600 transition-colors shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900">
                            Authentication / Switch Role
                          </span>
                          <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Quick switch between Owner, Staff, and Reviewer
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

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
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 flex justify-between items-center"
              >
                <span>Switch Role / Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
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

            <div className="pt-4 max-h-[60vh] overflow-y-auto">
              {searchQuery.trim().length > 0 ? (
                <div>
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Matching Products ({allProducts.filter(p =>
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length})
                  </div>

                  <div className="space-y-1.5">
                    {allProducts
                      .filter(p =>
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 6)
                      .map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={() => setSearchModalOpen(false)}
                          className="p-2.5 rounded-2xl hover:bg-zinc-100 flex items-center justify-between gap-3 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-9 h-9 rounded-xl object-cover border border-zinc-200 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-xs shrink-0">
                                📦
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-zinc-950 group-hover:text-zinc-700 transition-colors">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono">
                                {p.sku} &bull; {p.categoryName}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-semibold">
                              {p.inventory.currentStock} in stock
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </Link>
                      ))}

                    {allProducts.filter(p =>
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                      <div className="py-6 text-center text-xs text-zinc-500">
                        No products found matching &ldquo;{searchQuery}&rdquo;.
                      </div>
                    )}

                    <div className="pt-2 border-t border-zinc-100 text-center">
                      <Link
                        href={`/products?q=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setSearchModalOpen(false)}
                        className="text-xs font-semibold text-zinc-700 hover:text-zinc-950"
                      >
                        View all results in Catalogue &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
