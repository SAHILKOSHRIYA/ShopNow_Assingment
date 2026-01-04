"use client";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/store";
import { addToCart } from "@/lib/slices/cartSlice";
import type { Product } from "@/lib/productsApi";

export function ProductDetailActions({ product }: { product: Product }) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAdd = () => {
    const productName = product.name || product.title;
    const imageUrl = product.imageUrl || product.image;
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

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        onClick={handleAdd}
        className="inline-flex items-center justify-center rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-6 py-2 text-sm font-medium text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-2"
      >
        Add to Cart
      </button>
    </div>
  );
}


