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
    <nav className="sticky top-0 z-50 w-full bg-[#131921] px-2 sm:px-3 py-2 shadow-md">
      <div className="flex items-center gap-2 sm:gap-3 w-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 px-1 sm:px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded transition-all"
          aria-label="ShopNow Home"
        >
          <span className="text-lg sm:text-2xl font-bold text-white">ShopNow</span>
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" />
          </svg>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-1 items-center min-w-0">
          <div className="flex flex-1 items-stretch w-full">
            <div className="flex flex-1 items-center bg-white rounded-l-md border border-transparent focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400 min-w-0 relative">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 ml-2 sm:ml-3 flex-shrink-0 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 sm:h-10 flex-1 border-0 pl-2 pr-8 sm:pr-10 py-1 sm:py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 bg-transparent min-w-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 sm:right-3 p-1.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0 z-10"
                  aria-label="Clear search"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="flex h-8 sm:h-10 w-10 sm:w-14 items-center justify-center bg-orange-400 hover:bg-orange-500 active:bg-orange-600 transition-colors rounded-r-md border border-orange-400 flex-shrink-0"
              aria-label="Search"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Returns & Orders */}
        <Link
          href="/orders"
          className="hidden px-2 py-1 text-xs sm:text-sm text-white hover:outline hover:outline-1 hover:outline-white rounded transition-all lg:block"
          aria-label="Returns and Orders"
        >
          <div className="text-xs leading-tight">Returns</div>
          <div className="font-semibold leading-tight">& Orders</div>
        </Link>

        {/* Cart */}
        <Link
          href="/checkout"
          className="relative flex items-center gap-1 px-2 py-1 text-white hover:outline hover:outline-1 hover:outline-white rounded transition-all"
          aria-label={`Cart with ${itemCount} items`}
        >
          <div className="relative">
            <svg
              className="h-7 w-7 sm:h-8 sm:w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 sm:-right-2 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-orange-400 text-[10px] sm:text-xs font-bold text-zinc-900">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </div>
          <span className="hidden font-semibold md:inline">Cart</span>
        </Link>

      </div>
    </nav>
  );
}

