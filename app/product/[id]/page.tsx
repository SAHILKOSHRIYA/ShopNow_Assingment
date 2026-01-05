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
      <main className="bg-[#EAEDED] min-h-screen">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Link
              href="/"
              className="w-fit text-xs sm:text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
            >
              ← Back to products
            </Link>
          </div>
          <div className="grid gap-4 sm:gap-6 lg:gap-8 bg-white border border-gray-200 rounded-sm p-4 sm:p-6 md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden bg-white animate-pulse" />
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
        <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Link
              href="/"
              className="w-fit text-xs sm:text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
            >
              ← Back to products
            </Link>
          </div>
          <div className="bg-white border border-red-200 rounded-sm p-4 sm:p-6">
            <p className="text-sm text-red-600">
              Failed to load product. Please try again.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const rating = product.ratingValue ?? product.rating?.rate ?? 0;
  const reviewCount = product.reviewCount ?? product.rating?.count ?? 0;

  return (
    <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
      <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Link
            href="/"
            className="w-fit text-xs sm:text-sm text-[#007185] hover:text-[#C7511F] hover:underline"
          >
            ← Back to products
          </Link>
        </div>
        <div className="grid gap-4 sm:gap-6 lg:gap-8 bg-white border border-gray-200 rounded-sm p-4 sm:p-6 md:grid-cols-2">
          <div className="relative aspect-square w-full overflow-hidden bg-white">
            <Image
              src={product.image || product.imageUrl || ""}
              alt={product.title || product.name || "Product"}
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-contain p-4 sm:p-6"
            />
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {product.category}
            </p>
            <h1 className="text-xl sm:text-2xl font-normal text-gray-900 leading-tight">
              {product.title || product.name}
            </h1>
            <div className="flex items-center gap-2">
              <RatingStars rating={rating} reviewCount={reviewCount} size="md" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-normal text-[#B12704]">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description}
            </p>
            <ProductDetailActions product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}


