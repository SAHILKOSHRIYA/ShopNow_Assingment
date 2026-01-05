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
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-zinc-900">
        Cart ({itemCount})
      </h2>
      <div className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1 text-sm">
        {items.map((item) => {
          const itemId = item.productId || item.id!;
          const itemName = item.name || item.title!;
          return (
            <div
              key={itemId}
              className="flex items-center justify-between gap-2 sm:gap-3 border-b border-zinc-100 pb-2 last:border-none"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900 text-xs sm:text-sm">
                  {itemName}
                </p>
                <p className="text-xs text-zinc-500">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="flex items-center border border-zinc-300 rounded-md overflow-hidden bg-white">
                  <button
                    onClick={() => handleDecrease(itemId, item.quantity)}
                    className="p-1 sm:p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-zinc-900 min-w-[2ch] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(itemId, item.quantity)}
                    className="p-1 sm:p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(itemId))}
                  className="p-1.5 sm:p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  aria-label="Remove item"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex items-center justify-between text-sm font-medium border-t border-zinc-200 pt-3">
        <span className="text-zinc-600">Total</span>
        <span className="text-emerald-600">
          ${total.toFixed(2)}
        </span>
      </div>
      <Link
        href="/checkout"
        className="mt-1 block w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        Checkout
      </Link>
    </div>
  );
}


