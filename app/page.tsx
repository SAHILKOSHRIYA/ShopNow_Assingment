"use client";

import { useMemo, useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "@/lib/api/productsApi";
import { ProductCard } from "./components/ProductCard";
import { ProductCardSkeleton } from "./components/ProductCardSkeleton";

type SortOption = "default" | "price-asc" | "price-desc" | "rating-desc" | "name-asc";

export default function Home() {
  return (
    <Suspense fallback={
      <main className="bg-white min-h-screen w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
    <main className="bg-white min-h-screen w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Sort */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center text-black">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
              </svg>
            </div>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-gray-50 border-none text-black text-sm font-medium py-2 pl-4 pr-8 uppercase focus:ring-1 focus:ring-black cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Products" : c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center text-black">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013 8.25h9.75a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm15-.75A.75.75 0 0118 9v10.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V9a.75.75 0 01.75-.75zm-15 5.25a.75.75 0 01.75-.75h9.75a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full appearance-none bg-gray-50 border-none text-black text-sm font-medium py-2 pl-4 pr-8 uppercase focus:ring-1 focus:ring-black cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low - High</option>
                <option value="price-desc">Price: High - Low</option>
                <option value="rating-desc">Top Rated</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : apiError ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-500">
              Unable to load products. Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {!sorted.length && (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl font-bold text-black mb-2">No matches found</p>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

