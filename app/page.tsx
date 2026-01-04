"use client";

import { useMemo, useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "@/lib/api/productsApi";
import { ProductCard } from "./components/ProductCard";
import { ProductCardSkeleton } from "./components/ProductCardSkeleton";

function HomeContent() {
  const searchParams = useSearchParams();
  const { data: products = [], isLoading: loading, error: apiError } = useGetProductsQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

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
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "all" || p.category === category;
        return matchesSearch && matchesCategory;
      }),
    [products, search, category]
  );

  return (
    <main className="bg-[#EAEDED] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Category Filter - Amazon style */}
        <div className="mb-4 bg-white rounded-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Filter by category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 max-w-xs rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {!filtered.length && (
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
      <main className="bg-[#EAEDED] min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

