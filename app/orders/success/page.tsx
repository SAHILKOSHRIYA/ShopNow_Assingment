"use client";

import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { RootState } from "@/lib/store";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const latestOrder = orders[0]; // Most recent order

  return (
    <main className="bg-[#EAEDED] min-h-screen flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-sm p-6 sm:p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          {latestOrder && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Order ID: {latestOrder.orderId}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-6 py-2.5 text-sm font-medium text-black transition-colors"
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
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors"
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
        <main className="bg-[#EAEDED] min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
