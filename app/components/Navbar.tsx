"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { calculateItemCount } from "@/lib/utils/priceCalculator";

export function Navbar() {
  const items = useSelector((state: RootState) => state.cart.items);
  const itemCount = useMemo(() => calculateItemCount(items), [items]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  }, [searchQuery, router]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    router.push("/");
  }, [router]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-4 py-4 uppercase tracking-wider font-bold text-sm">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
          aria-label="ShopNow Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37]"
          >
            <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
          </svg>
          <span className="text-2xl font-black text-black">SHOPNOW</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
          <input
            type="text"
            placeholder="SEARCH"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-10 pl-6 pr-20 rounded-full border border-gray-200 bg-gray-50 text-black placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all ${searchQuery ? "shadow-md" : ""}`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
          <button
            type="submit"
            className="absolute right-0 top-0 h-10 px-4 text-black hover:text-[#D4AF37] transition-colors rounded-r-full"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        <div className="flex items-center gap-6">
          {/* Returns & Orders */}
          <Link
            href="/orders"
            className="hidden lg:block text-black hover:underline"
            aria-label="Returns and Orders"
          >
            Orders
          </Link>

          {/* Cart */}
          <Link
            href="/checkout"
            className="relative flex items-center gap-1 text-black hover:opacity-75 transition-opacity"
            aria-label={`Cart with ${itemCount} items`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

