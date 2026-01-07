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
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-sm font-bold uppercase tracking-wider text-black hover:underline"
            >
              ← Back to Shop
            </Link>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-square w-full bg-gray-100 animate-pulse" />
            <div className="flex flex-col gap-6">
              <div className="h-4 w-24 bg-gray-100 animate-pulse" />
              <div className="h-12 w-3/4 bg-gray-100 animate-pulse" />
              <div className="h-6 w-32 bg-gray-100 animate-pulse" />
              <div className="h-40 w-full bg-gray-100 animate-pulse" />
              <div className="h-12 w-48 bg-gray-100 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="bg-white min-h-screen w-full">
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-sm font-bold uppercase tracking-wider text-black hover:underline"
            >
              ← Back to Shop
            </Link>
          </div>
          <div className="py-20 text-center">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-4">Product Not Found</h1>
            <p className="text-gray-500">
              The product you are looking for does not exist or could not be loaded.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const rating = product.ratingValue ?? product.rating?.rate ?? 0;
  const reviewCount = product.reviewCount ?? product.rating?.count ?? 0;

  return (
    <main className="bg-white min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-wider text-black hover:underline"
          >
            ← Back to Shop
          </Link>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square w-full bg-gray-50 border border-gray-100">
            <Image
              src={product.image || product.imageUrl || ""}
              alt={product.title || product.name || "Product"}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-8 mix-blend-multiply"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div className="border-b border-gray-100 pb-6">
              <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest px-2 py-1 mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-black leading-tight uppercase tracking-tight mb-4">
                {product.title || product.name}
              </h1>
              <div className="flex items-center gap-4">
                <RatingStars rating={rating} reviewCount={reviewCount} size="md" />
                <span className="text-sm font-medium text-gray-500">|</span>
                <span className="text-sm font-medium text-gray-500">{reviewCount} Reviews</span>
              </div>
            </div>

            <div>
              <span className="text-3xl font-bold text-black">
                ${product.price.toFixed(2)}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Tax included.
              </p>
            </div>

            <div className="prose prose-sm text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <ProductDetailActions product={product} />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50">
                <svg className="w-6 h-6 mx-auto mb-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-xs font-bold uppercase tracking-wider">Authentic</p>
              </div>
              <div className="p-4 bg-gray-50">
                <svg className="w-6 h-6 mx-auto mb-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-xs font-bold uppercase tracking-wider">Free Shipping</p>
              </div>
              <div className="p-4 bg-gray-50">
                <svg className="w-6 h-6 mx-auto mb-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-xs font-bold uppercase tracking-wider">Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
