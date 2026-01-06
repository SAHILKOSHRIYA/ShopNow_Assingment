"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addToCart, removeFromCart } from "@/lib/slices/cartSlice";
import type { AppDispatch, RootState } from "@/lib/store";
import type { Product } from "@/lib/productsApi";
import { RatingStars } from "./RatingStars";
import Link from "next/link";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Get rating and review count from product
  const rating = product.ratingValue ?? product.rating?.rate ?? 0;
  const reviewCount = product.reviewCount ?? product.rating?.count ?? 0;
  const productName = product.name || product.title;
  const imageUrl = product.imageUrl || product.image;

  // Check if product is in cart
  const cartItem = items.find(item => (item.productId || item.id) === product.id);
  const isInCart = !!cartItem;

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

  const handleRemove = () => {
    const itemId = product.id;
    dispatch(removeFromCart(itemId));
  };

  const isOutOfStock = product.availableStock !== undefined && product.availableStock === 0;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-sm p-2 h-full hover:shadow-md transition-shadow">
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-white mb-2">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-2"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-2 text-xs sm:text-sm text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer leading-tight"
        >
          {productName}
        </Link>

        {/* Rating and Reviews */}
        <RatingStars rating={rating} reviewCount={reviewCount} size="sm" />

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-base sm:text-lg font-bold text-[#B12704]">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart / Remove from Cart Button */}
        {isInCart ? (
          <button
            onClick={handleRemove}
            disabled={isOutOfStock}
            className="mt-auto w-full rounded-md bg-red-500 hover:bg-red-600 border border-red-600 text-xs sm:text-sm font-medium text-white py-1.5 sm:py-2 px-2 sm:px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-300 disabled:border-gray-300"
            aria-label="Remove from cart"
          >
            Remove from Cart
          </button>
        ) : (
          <button
            onClick={handleAdd}
            disabled={isOutOfStock || isAdding}
            className="mt-auto w-full rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs sm:text-sm font-medium text-black py-1.5 sm:py-2 px-2 sm:px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-300 disabled:border-gray-300"
            aria-label={isOutOfStock ? "Out of stock" : isAdding ? "Adding to cart" : "Add to cart"}
          >
            {isAdding ? (
              <span className="flex items-center justify-center gap-1">
                <svg className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding...
              </span>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              "Add to Cart"
            )}
          </button>
        )}
      </div>
    </div>
  );
}


