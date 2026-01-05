"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { cancelOrder } from "@/lib/slices/ordersSlice";
import { addToCart } from "@/lib/slices/cartSlice";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function OrdersContent() {
  const orders = useSelector((state: RootState) => state.orders.orders);
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(orderId));
    }
  };

  const handleBuyAgain = (orderItems: typeof orders[0]["items"]) => {
    orderItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        dispatch(
          addToCart({
            productId: item.productId || item.id!,
            name: item.name || item.title!,
            price: item.price,
            imageUrl: item.imageUrl || item.image!,
            id: item.productId || item.id!,
            title: item.name || item.title!,
            image: item.imageUrl || item.image!,
          })
        );
      }
    });
    // Navigate to checkout
    window.location.href = "/checkout";
  };

  if (orders.length === 0) {
    return (
      <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
        <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
          <h1 className="text-xl sm:text-2xl font-normal text-gray-900 mb-4 sm:mb-6">Your Orders</h1>
          <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-6 py-2 text-sm font-medium text-black transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
      <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
        <h1 className="text-xl sm:text-2xl font-normal text-gray-900 mb-4 sm:mb-6">Your Orders</h1>

        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-800 font-medium">Order placed successfully!</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-600 hover:text-green-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.orderId} className="bg-white border border-gray-200 rounded-sm mb-4">
            {/* Order Summary */}
            <div className="bg-gray-50 border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-600">Placed: </span>
                  <span className="font-medium text-gray-900">{formatDate(order.orderDate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total: </span>
                  <span className="font-medium text-gray-900">
                    ${order.pricing.orderTotal.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">ID: </span>
                  <span className="font-medium text-gray-900">{order.orderId}</span>
                </div>
                {order.status === "preparing" && (
                  <button
                    onClick={() => handleCancelOrder(order.orderId)}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="p-3 sm:p-4">
              {order.items.map((item, index) => {
                const itemId = item.productId || item.id!;
                const itemName = item.name || item.title!;
                const itemImage = item.imageUrl || item.image!;
                const arrivalDate = formatFullDate(order.deliveryOption.date);

                return (
                  <div
                    key={`${itemId}-${index}`}
                    className={`flex gap-3 sm:gap-4 ${index < order.items.length - 1 ? "pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-gray-200" : ""}`}
                  >
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden bg-white border border-gray-200 rounded-sm">
                      <Image
                        src={itemImage}
                        alt={itemName}
                        fill
                        sizes="96px"
                        className="object-contain p-1 sm:p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2">{itemName}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                        Arriving: {arrivalDate}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Qty: {item.quantity}</p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Link
                          href={`/orders/${order.orderId}?itemIndex=${index}`}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 transition-colors"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Track
                        </Link>
                        <button
                          onClick={() => handleBuyAgain([item])}
                          className="inline-flex items-center justify-center rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-black transition-colors"
                        >
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Buy Again
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleBuyAgain(order.items)}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Buy All Again
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <main className="bg-[#EAEDED] min-h-screen">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl font-normal text-gray-900 mb-4 sm:mb-6">Your Orders</h1>
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      </main>
    }>
      <OrdersContent />
    </Suspense>
  );
}


