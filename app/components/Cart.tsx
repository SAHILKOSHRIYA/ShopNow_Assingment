"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import type { RootState, AppDispatch } from "@/lib/store";
import { removeFromCart, updateQuantity } from "@/lib/slices/cartSlice";
import { calculateItemCount, calculateCartSubtotal } from "@/lib/utils/priceCalculator";

export function Cart() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const itemCount = calculateItemCount(items);
  const total = calculateCartSubtotal(items);

  const handleDecrease = (itemId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id: itemId, quantity: currentQuantity - 1 }));
    } else {
      dispatch(removeFromCart(itemId));
    }
  };

  const handleIncrease = (itemId: number, currentQuantity: number) => {
    dispatch(updateQuantity({ id: itemId, quantity: currentQuantity + 1 }));
  };

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500 text-center">
        Cart is empty
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-none border border-gray-100 bg-white p-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
        Cart ({itemCount})
      </h2>
      <div className="flex max-h-72 flex-col gap-4 overflow-y-auto pr-1">
        {items.map((item) => {
          const itemId = item.productId || item.id!;
          const itemName = item.name || item.title!;
          return (
            <div
              key={itemId}
              className="flex items-start justify-between gap-3 pb-4 border-b border-gray-50 last:border-none"
            >
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-bold text-black text-xs uppercase tracking-wide mb-1">
                  {itemName}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(itemId))}
                    className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase underline"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center border border-black bg-white">
                  <button
                    onClick={() => handleDecrease(itemId, item.quantity)}
                    className="p-1 px-2 text-black hover:bg-gray-100 transition-colors text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 py-1 text-xs font-bold text-black min-w-[2ch] text-center border-l border-r border-black">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(itemId, item.quantity)}
                    className="p-1 px-2 text-black hover:bg-gray-100 transition-colors text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-sm font-bold border-t border-black pt-4">
        <span className="text-black uppercase tracking-wider">Total</span>
        <span className="text-black">
          ${total.toFixed(2)}
        </span>
      </div>
      <Link
        href="/checkout"
        className="mt-2 block w-full bg-black px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-white transition hover:bg-gray-800"
      >
        Checkout
      </Link>
    </div>
  );
}


