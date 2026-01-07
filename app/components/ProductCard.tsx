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
    <div className="group flex flex-col bg-white h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-gray-50 p-6">
        <Image
          src={imageUrl}
          alt={productName}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain mix-blend-multiply transition-transform group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#E6E6FA] text-black px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <Link
          href={`/product/${product.id}`}
          className="text-sm font-bold text-gray-900 mb-2 line-clamp-1 hover:text-black transition-colors"
          title={productName}
        >
          {productName}
        </Link>

        {/* Rating */}
        <div className="mb-4">
          <RatingStars rating={rating} reviewCount={reviewCount} size="sm" />
        </div>

        {/* Price and Add Button Row */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-black text-black">
            ${product.price.toFixed(2)}
          </span>

          {isInCart ? (
            <button
              onClick={handleRemove}
              disabled={isOutOfStock}
              className="flex items-center gap-2 bg-[#E6E6FA] hover:bg-[#D8BFD8] text-black text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove from cart"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={handleAdd}
              disabled={isOutOfStock || isAdding}
              className="flex items-center gap-2 bg-[#232F3E] hover:bg-black text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl"
              aria-label={isOutOfStock ? "Out of stock" : isAdding ? "Adding to cart" : "Add to cart"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {isAdding ? "..." : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


