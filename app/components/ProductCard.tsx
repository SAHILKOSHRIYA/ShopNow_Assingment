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
    <div className="group flex flex-col bg-white h-full transition-transform hover:-translate-y-1 duration-300">
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 mb-4">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-4 mix-blend-multiply transition-transform group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute top-2 left-2">
            <span className="bg-[#E6E6FA] text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-4">
        {/* Rating and Reviews */}
        <div className="mb-2">
          <RatingStars rating={rating} reviewCount={reviewCount} size="sm" />
        </div>

        <Link
          href={`/product/${product.id}`}
          className="text-sm font-medium text-black hover:text-gray-600 mb-2 line-clamp-2 uppercase tracking-wide cursor-pointer"
        >
          {productName}
        </Link>

        {/* Price */}
        <div className="mb-4">
          <span className="text-lg font-bold text-black">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart / Remove from Cart Button */}
        <div className="mt-auto">
          {isInCart ? (
            <button
              onClick={handleRemove}
              disabled={isOutOfStock}
              className="w-full bg-[#E6E6FA] hover:bg-[#D8BFD8] text-black text-sm font-bold uppercase tracking-wider py-3 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove from cart"
            >
              Remove from Cart
            </button>
          ) : (
            <button
              onClick={handleAdd}
              disabled={isOutOfStock || isAdding}
              className="w-full bg-black hover:bg-gray-800 text-white text-sm font-bold uppercase tracking-wider py-3 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg"
              aria-label={isOutOfStock ? "Out of stock" : isAdding ? "Adding to cart" : "Add to cart"}
            >
              {isAdding ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing
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
    </div>
  );
}


