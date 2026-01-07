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
      <main className="bg-white min-h-screen w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-8">Your Orders</h1>
          <div className="bg-gray-50 border border-gray-100 p-12 text-center">
            <p className="text-gray-600 mb-6 font-medium uppercase tracking-wide">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block bg-black hover:bg-gray-800 text-white text-sm font-bold uppercase tracking-widest px-8 py-4 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-8">Your Orders</h1>

        {showSuccess && (
          <div className="mb-8 bg-[#E6E6FA] border border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-black font-bold uppercase tracking-wider text-sm">Order placed successfully!</span>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-black hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.orderId} className="bg-white border-t border-gray-200 py-8 mb-8">
            {/* Order Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex flex-wrap gap-8 text-sm">
                <div>
                  <span className="block text-gray-500 uppercase tracking-widest text-xs mb-1">Placed</span>
                  <span className="font-bold text-black uppercase tracking-wide">{formatDate(order.orderDate)}</span>
                </div>
                <div>
                  <span className="block text-gray-500 uppercase tracking-widest text-xs mb-1">Total</span>
                  <span className="font-bold text-black">
                    ${order.pricing.orderTotal.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 uppercase tracking-widest text-xs mb-1">Order #</span>
                  <span className="font-bold text-black uppercase tracking-wide">{order.orderId.slice(0, 8)}...</span>
                </div>
              </div>

              {order.status === "preparing" && (
                <button
                  onClick={() => handleCancelOrder(order.orderId)}
                  className="text-black hover:text-red-600 text-xs font-bold uppercase tracking-wider underline decoration-2 underline-offset-4"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Order Items */}
            <div className="space-y-8">
              {order.items.map((item, index) => {
                const itemId = item.productId || item.id!;
                const itemName = item.name || item.title!;
                const itemImage = item.imageUrl || item.image!;
                const arrivalDate = formatFullDate(order.deliveryOption.date);

                return (
                  <div
                    key={`${itemId}-${index}`}
                    className="flex gap-6"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-gray-50">
                      <Image
                        src={itemImage}
                        alt={itemName}
                        fill
                        sizes="96px"
                        className="object-contain p-2 mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-black text-sm sm:text-base uppercase tracking-wide mb-2 max-w-xl">
                          {itemName}
                        </h3>
                        <p className="text-sm font-medium text-black">
                          Arriving: <span className="text-gray-600">{arrivalDate}</span>
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4">
                        <Link
                          href={`/orders/${order.orderId}?itemIndex=${index}`}
                          className="inline-flex items-center justify-center border border-black bg-white hover:bg-black hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          Track Package
                        </Link>
                        <button
                          onClick={() => handleBuyAgain([item])}
                          className="inline-flex items-center justify-center bg-black text-white hover:bg-gray-800 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          Buy Again
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

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-8">Your Orders</h1>
          <div className="text-center text-gray-500 font-medium uppercase tracking-wider">Loading...</div>
        </div>
      </main>
    }>
      <OrdersContent />
    </Suspense>
  );
}
