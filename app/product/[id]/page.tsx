"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { useGetProductQuery } from "@/lib/api/productsApi";
import { ProductDetailActions } from "./product-actions";
import { RatingStars } from "../../components/RatingStars";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProductPage({ params }: Props) {
  const { id } = use(params);
  const { data: product, isLoading, error } = useGetProductQuery(id);

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8">
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 items-start">
            <div className="aspect-square w-full rounded-2xl bg-gray-50 animate-pulse max-h-[400px]" />
            <div className="flex flex-col gap-6 h-full justify-center">
              <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
              <div className="h-10 w-3/4 bg-gray-100 animate-pulse rounded" />
              <div className="h-6 w-32 bg-gray-100 animate-pulse rounded" />
              <div className="h-24 w-full bg-gray-100 animate-pulse rounded" />
              <div className="h-12 w-full bg-gray-100 animate-pulse rounded mt-auto" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="bg-white min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-4">Product Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Shop</Link>
        </div>
      </main>
    );
  }

  const rating = product.ratingValue ?? product.rating?.rate ?? 0;
  const reviewCount = product.reviewCount ?? product.rating?.count ?? 0;

  return (
    <main className="bg-white min-h-screen w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-6">

        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Shop
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-10 items-center">

          {/* Left Column: Image Card */}
          <div className="relative aspect-square w-full max-h-[400px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden md:sticky md:top-24 mx-auto">
            <Image
              src={product.image || product.imageUrl || ""}
              alt={product.title || product.name || "Product"}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-6 mix-blend-multiply hover:scale-105 transition-transform duration-500"
              priority
            />
            {/* Out of Stock Badge */}
            {product.availableStock === 0 && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-gray-100 text-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Key Details */}
          <div className="flex flex-col h-full py-2">

            {/* Category */}
            <div className="mb-2">
              <span className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black text-black leading-tight uppercase tracking-tight mb-3">
              {product.title || product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-[#FFD814]">
                <RatingStars rating={rating} reviewCount={reviewCount} size="sm" />
              </div>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs font-medium text-blue-600 hover:underline cursor-pointer">
                {reviewCount} Reviews
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-600 leading-relaxed mb-6">
              <p className="line-clamp-5 text-xs sm:text-sm">{product.description}</p>
            </div>

            {/* Price & Action Row (Bottom Aligned) */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-black tracking-tight">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Tax included.</span>
              </div>

              <ProductDetailActions product={product} />
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                In Stock
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
