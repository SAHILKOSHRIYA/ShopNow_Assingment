"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addToCart } from "@/lib/slices/cartSlice";
import type { AppDispatch } from "@/lib/store";
import type { Product } from "@/lib/productsApi";
import { RatingStars } from "./RatingStars";
import Link from "next/link";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Get rating and review count from product
  const rating = product.ratingValue ?? product.rating?.rate ?? 0;
  const reviewCount = product.reviewCount ?? product.rating?.count ?? 0;
  const productName = product.name || product.title;
  const imageUrl = product.imageUrl || product.image;

  const handleAdd = async () => {
    setIsAdding(true);
    // Optimistic UI update - add quantity times
    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          productId: product.id,
          name: productName,
          price: product.price,
          imageUrl: imageUrl,
          // Backward compatibility
          id: product.id,
          title: productName,
          image: imageUrl,
        })
      );
    }
    // Reset quantity and show feedback
    setTimeout(() => {
      setQuantity(1);
      setIsAdding(false);
    }, 300);
  };

  const isOutOfStock = product.availableStock !== undefined && product.availableStock === 0;

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-contain p-4"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-2 text-sm font-semibold text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
        >
          {productName}
        </Link>
        
        {/* Rating and Reviews */}
        <RatingStars rating={rating} reviewCount={reviewCount} size="sm" />
        
        {/* Price */}
        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          ${product.price.toFixed(2)}
        </span>

        {/* Quantity Selector and Add to Cart */}
        <div className="mt-auto flex items-center gap-2">
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={isOutOfStock || isAdding}
            className="flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 disabled:opacity-50"
          >
            {Array.from({ length: Math.min(product.availableStock ?? 10, 10) }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={isOutOfStock || isAdding}
            className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-4 py-1.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-zinc-900"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}


