"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
  const orders = useSelector((state: RootState) => state.orders.orders);

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

  if (orders.length === 0) {
    return (
      <main className="bg-[#EAEDED] min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-normal text-gray-900 mb-6">Your Orders</h1>
          <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
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
    <main className="bg-[#EAEDED] min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-normal text-gray-900 mb-6">Your Orders</h1>

        {orders.map((order) => (
          <div key={order.orderId} className="bg-white border border-gray-200 rounded-sm mb-4">
            {/* Order Summary */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order Placed: </span>
                  <span className="font-medium text-gray-900">{formatDate(order.orderDate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total: </span>
                  <span className="font-medium text-gray-900">
                    ${order.pricing.orderTotal.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Order ID: </span>
                  <span className="font-medium text-gray-900">{order.orderId}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4">
              {order.items.map((item, index) => {
                const itemId = item.productId || item.id!;
                const itemName = item.name || item.title!;
                const itemImage = item.imageUrl || item.image!;
                const arrivalDate = formatFullDate(order.deliveryOption.date);

                return (
                  <div
                    key={`${itemId}-${index}`}
                    className={`flex gap-4 ${index < order.items.length - 1 ? "pb-4 mb-4 border-b border-gray-200" : ""}`}
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-white border border-gray-200 rounded-sm">
                      <Image
                        src={itemImage}
                        alt={itemName}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{itemName}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Arriving on: {arrivalDate}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">Quantity: {item.quantity}</p>
                      <div className="flex gap-3">
                        <Link
                          href={`/orders/${order.orderId}?itemIndex=${index}`}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Track package
                        </Link>
                        <button className="inline-flex items-center justify-center rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-3 py-1.5 text-sm font-medium text-black transition-colors">
                          <svg
                            className="w-4 h-4 mr-1"
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
                          Buy it again
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}


