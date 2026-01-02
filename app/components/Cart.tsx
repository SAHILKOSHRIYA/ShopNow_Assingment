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

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
        Your cart is empty. Start adding some products!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h2>
      <div className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1 text-sm">
        {items.map((item) => {
          const itemId = item.productId || item.id!;
          const itemName = item.name || item.title!;
          return (
            <div
              key={itemId}
              className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-2 last:border-none dark:border-zinc-800"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                  {itemName}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  ${item.price.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        id: itemId,
                        quantity: Number(e.target.value) || 1,
                      })
                    )
                  }
                  className="h-8 w-14 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <button
                  onClick={() => dispatch(removeFromCart(itemId))}
                  className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex items-center justify-between text-sm font-medium">
        <span className="text-zinc-600 dark:text-zinc-300">Total</span>
        <span className="text-emerald-600 dark:text-emerald-400">
          ${total.toFixed(2)}
        </span>
      </div>
      <Link
        href="/checkout"
        className="mt-3 block w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}


