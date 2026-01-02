"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import {
  updateQuantity,
  removeFromCart,
  setShippingOption,
  clearCart,
  type ShippingOption,
  type CartItem,
} from "@/lib/slices/cartSlice";
import { calculatePriceBreakdown } from "@/lib/utils/priceCalculator";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "../components/ThemeToggle";

export type OrderPayload = {
  items: CartItem[];
  deliveryOption: ShippingOption;
  pricing: {
    itemsTotal: number;
    shippingCost: number;
    tax: number;
    orderTotal: number;
  };
};

function getDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getShippingOptions(): ShippingOption[] {
  return [
    {
      id: "fast",
      date: getDateString(3),
      label: getDateString(3),
      price: 9.99,
      isFree: false,
    },
    {
      id: "standard",
      date: getDateString(2),
      label: getDateString(2),
      price: 4.99,
      isFree: false,
    },
    {
      id: "free",
      date: getDateString(1),
      label: getDateString(1),
      price: 0,
      isFree: true,
    },
  ];
}

// Default to cheapest option (usually free)
function getDefaultShippingOption(options: ShippingOption[]): ShippingOption {
  return options.reduce((cheapest, current) =>
    current.price < cheapest.price ? current : cheapest
  );
}

export default function CheckoutPage() {
  const items = useSelector((state: RootState) => state.cart.items);
  const selectedShipping = useSelector(
    (state: RootState) => state.cart.selectedShipping
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const shippingOptions = getShippingOptions();

  // Set default shipping to cheapest option if none selected
  useEffect(() => {
    if (!selectedShipping && shippingOptions.length > 0) {
      const defaultOption = getDefaultShippingOption(shippingOptions);
      dispatch(setShippingOption(defaultOption));
    }
  }, [selectedShipping, shippingOptions, dispatch]);

  // Use price calculator for all derived values
  const currentShipping = selectedShipping || getDefaultShippingOption(shippingOptions);
  const priceBreakdown = calculatePriceBreakdown(items, currentShipping);

  const handlePlaceOrder = async () => {
    // Validation
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!currentShipping) {
      alert("Please select a delivery option!");
      return;
    }

    setIsPlacingOrder(true);

    // Create order payload
    const orderPayload: OrderPayload = {
      items: items.map((item) => ({
        productId: item.productId || item.id!,
        name: item.name || item.title!,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl || item.image!,
      })),
      deliveryOption: currentShipping,
      pricing: {
        itemsTotal: priceBreakdown.itemsTotal,
        shippingCost: priceBreakdown.shippingCost,
        tax: priceBreakdown.tax,
        orderTotal: priceBreakdown.orderTotal,
      },
    };

    try {
      // Simulate API call - replace with actual backend call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In production, send to backend:
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderPayload),
      // });
      // if (!response.ok) throw new Error('Order failed');

      console.log("Order placed:", orderPayload);
      
      // Clear cart and redirect
      dispatch(clearCart());
      alert("Order placed successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-4 px-4 py-10">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Your cart is empty
        </h1>
        <Link
          href="/"
          className="rounded-lg bg-emerald-600 px-6 py-2 text-white hover:bg-emerald-700"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Review your order
        </h1>
        <ThemeToggle />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Date */}
          {selectedShipping && (
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Delivery date: {selectedShipping.label}
              </p>
            </div>
          )}

          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => {
              const itemId = item.productId || item.id!;
              const itemName = item.name || item.title!;
              const itemImage = item.imageUrl || item.image!;
              return (
                <div
                  key={itemId}
                  className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={itemImage}
                      alt={itemName}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                      {itemName}
                    </h3>
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="mt-auto flex items-center gap-4 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Quantity: {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: itemId,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(itemId))}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shipping Options */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Choose a delivery option:
            </h2>
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 p-3 transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedShipping?.id === option.id}
                    onChange={() => dispatch(setShippingOption(option))}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {option.label}
                    </p>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {option.isFree ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        FREE Shipping
                      </span>
                    ) : (
                      `$${option.price.toFixed(2)} - Shipping`
                    )}
                  </p>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Order Summary
            </h2>
            <div className="space-y-3 border-b border-zinc-200 pb-4 dark:border-zinc-700">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Items ({priceBreakdown.itemCount}):
                </span>
                <span className="text-zinc-900 dark:text-zinc-50">
                  ${priceBreakdown.itemsTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Shipping & handling:
                </span>
                <span className="text-zinc-900 dark:text-zinc-50">
                  ${priceBreakdown.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Total before tax:
                </span>
                <span className="text-zinc-900 dark:text-zinc-50">
                  ${priceBreakdown.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Estimated tax (10%):
                </span>
                <span className="text-zinc-900 dark:text-zinc-50">
                  ${priceBreakdown.tax.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span className="text-red-600 dark:text-red-400">Order total:</span>
              <span className="text-red-600 dark:text-red-400">
                ${priceBreakdown.orderTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || items.length === 0 || !currentShipping}
              className="mt-6 w-full rounded-lg bg-yellow-400 px-4 py-3 font-medium text-zinc-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPlacingOrder ? "Placing order..." : "Place your order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

