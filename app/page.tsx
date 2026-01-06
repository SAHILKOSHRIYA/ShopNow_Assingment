"use client";

import { useMemo, useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "@/lib/api/productsApi";
import { ProductCard } from "./components/ProductCard";
import { ProductCardSkeleton } from "./components/ProductCardSkeleton";

type SortOption = "default" | "price-asc" | "price-desc" | "rating-desc" | "name-asc";

function HomeContent() {
  const searchParams = useSearchParams();
  const { data: products = [], isLoading: loading, error: apiError } = useGetProductsQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  // Read search query from URL
  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    setSearch(searchQuery);
  }, [searchParams]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchesSearch =
          !search ||
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "all" || p.category === category;
        return matchesSearch && matchesCategory;
      }),
    [products, search, category]
  );

  const sorted = useMemo(() => {
    const sortedProducts = [...filtered];
    switch (sortBy) {
      case "price-asc":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "rating-desc":
        return sortedProducts.sort((a, b) => {
          const ratingA = a.ratingValue ?? a.rating?.rate ?? 0;
          const ratingB = b.ratingValue ?? b.rating?.rate ?? 0;
          return ratingB - ratingA;
        });
      case "name-asc":
        return sortedProducts.sort((a, b) => {
          const nameA = (a.name || a.title || "").toLowerCase();
          const nameB = (b.name || b.title || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });
      default:
        return sortedProducts;
    }
  }, [filtered, sortBy]);

  return (
    <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
      <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
        {/* Filters and Sort */}
        <div className="mb-4 bg-white rounded-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 sm:max-w-xs rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-900 outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 sm:w-40 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-900 outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : apiError ? (
          <div className="bg-white rounded-sm border border-gray-200 p-6 text-center">
            <p className="text-sm text-red-600">
              Unable to load products. Please try again.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {!sorted.length && (
              <div className="col-span-full bg-white rounded-sm border border-gray-200 p-6 text-center">
                <p className="text-sm text-gray-600">
                  No products match your search.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
        <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}

