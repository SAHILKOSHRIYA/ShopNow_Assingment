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
    <div className="flex flex-col bg-white border border-gray-200 rounded-sm p-4 h-full hover:shadow-md transition-shadow">
      <Link href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-white mb-3">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-contain p-2"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-2 text-sm text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer leading-tight"
        >
          {productName}
        </Link>
        
        {/* Rating and Reviews */}
        <RatingStars rating={rating} reviewCount={reviewCount} size="sm" />
        
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-[#B12704]">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button - Amazon style */}
        <button
          onClick={handleAdd}
          disabled={isOutOfStock || isAdding}
          className="mt-2 w-full rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-sm font-medium text-black py-2 px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-300 disabled:border-gray-300"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}


