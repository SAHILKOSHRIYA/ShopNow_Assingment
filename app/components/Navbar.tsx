"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { RootState } from "@/lib/store";
import { calculateItemCount } from "@/lib/utils/priceCalculator";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const items = useSelector((state: RootState) => state.cart.items);
  const itemCount = calculateItemCount(items);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#131921] px-4 py-2 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-end gap-0.5 px-2 py-1 hover:outline hover:outline-1 hover:outline-white"
        >
          <span className="text-2xl font-bold text-white">ShopNow</span>
          <svg
            className="h-5 w-5 text-orange-400 -mb-0.5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M0 12 Q6 6, 12 6 Q18 6, 24 12" stroke="none" fill="currentColor" />
          </svg>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-1 items-center max-w-2xl">
          <div className="flex flex-1 items-stretch">
            <div className="flex flex-1 items-center bg-white rounded-l-md border border-transparent focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 flex-1 border-0 px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="flex h-10 w-14 items-center justify-center bg-orange-400 hover:bg-orange-500 active:bg-orange-600 transition-colors rounded-r-md border border-orange-400"
              aria-label="Search"
            >
              <svg
                className="h-5 w-5 text-white"
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
          className="hidden px-2 py-1 text-sm text-white hover:outline hover:outline-1 hover:outline-white sm:block"
        >
          <div className="text-xs leading-tight">Returns</div>
          <div className="font-semibold leading-tight">& Orders</div>
        </Link>

        {/* Cart */}
        <Link
          href="/checkout"
          className="relative flex items-center gap-1 px-2 py-1 text-white hover:outline hover:outline-1 hover:outline-white"
        >
          <div className="relative">
            <svg
              className="h-8 w-8"
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
              <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-zinc-900">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </div>
          <span className="hidden font-semibold sm:inline">Cart</span>
        </Link>

        {/* Theme Toggle */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

