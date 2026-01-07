"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { addToCart, removeFromCart } from "@/lib/slices/cartSlice";
import type { Product } from "@/lib/productsApi";

export function ProductDetailActions({ product }: { product: Product }) {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);

  const productName = product.name || product.title;
  const imageUrl = product.imageUrl || product.image;

  // Check if product is in cart
  const cartItem = items.find(item => (item.productId || item.id) === product.id);
  const isInCart = !!cartItem;

  const handleAdd = () => {
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
  };

  const handleRemove = () => {
    dispatch(removeFromCart(product.id));
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {isInCart ? (
        <button
          onClick={handleRemove}
          className="inline-flex items-center gap-2 justify-center rounded-lg bg-[#E6E6FA] hover:bg-[#D8BFD8] text-black px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          Remove
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 justify-center rounded-lg bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors shadow-lg hover:shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          Add to Cart
        </button>
      )}
    </div>
  );
}


