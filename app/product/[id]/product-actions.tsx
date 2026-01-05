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
          className="inline-flex items-center justify-center rounded-md bg-red-500 hover:bg-red-600 border border-red-600 px-4 sm:px-6 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Remove from Cart
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-4 sm:px-6 py-2 text-sm font-medium text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-2"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}


