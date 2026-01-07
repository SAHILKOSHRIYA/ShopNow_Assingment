"use client";

import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import type { RootState } from "@/lib/store";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const latestOrder = orders[0]; // Most recent order
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="bg-white min-h-screen flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 sm:mb-12">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-6">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-base sm:text-lg font-medium text-gray-600 mb-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          {mounted && latestOrder && (
            <p className="text-sm font-bold text-black uppercase tracking-wide">
              Order ID: {latestOrder.orderId}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center bg-black hover:bg-gray-800 text-white border border-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Track Your Order
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-black border border-black px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-black font-bold uppercase tracking-wide">Loading...</div>
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
