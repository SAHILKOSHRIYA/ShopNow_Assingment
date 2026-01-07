"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Props = {
  params: Promise<{ orderId: string }>;
};

function OrderTrackingContent({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const itemIndex = parseInt(searchParams.get("itemIndex") || "0");
  const orders = useSelector((state: RootState) => state.orders.orders);
  const order = orders.find((o) => o.orderId === orderId);

  if (!order) {
    return (
      <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
        <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
          <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 text-center">
            <h1 className="text-lg sm:text-xl font-normal text-gray-900 mb-4">Order not found</h1>
            <Link
              href="/orders"
              className="text-[#007185] hover:text-[#C7511F] hover:underline"
            >
              View all orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const item = order.items[itemIndex];
  if (!item) {
    return (
      <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
        <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
          <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 text-center">
            <h1 className="text-lg sm:text-xl font-normal text-gray-900 mb-4">Item not found</h1>
            <Link
              href="/orders"
              className="text-[#007185] hover:text-[#C7511F] hover:underline"
            >
              View all orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const itemName = item.name || item.title!;
  const itemImage = item.imageUrl || item.image!;
  const formattedDate = order.deliveryOption.date;

  const getProgress = () => {
    switch (order.status) {
      case "preparing":
        return 33;
      case "shipped":
        return 66;
      case "delivered":
        return 100;
      default:
        return 33;
    }
  };

  const progress = getProgress();

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <Link
          href="/orders"
          className="inline-block text-black hover:text-gray-600 hover:underline text-xs font-bold uppercase tracking-widest mb-4"
        >
          View all orders
        </Link>

        <div className="bg-white border border-gray-100 rounded-sm p-4 sm:p-6 shadow-sm">
          <h1 className="text-lg sm:text-xl font-bold text-black uppercase tracking-tight mb-2">
            Arriving on {formattedDate}
          </h1>

          <div className="mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wide mb-1 truncate">{itemName}</h2>
            <p className="text-xs text-gray-600 font-medium">Quantity: {item.quantity}</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-center">
              <Image
                src={itemImage}
                alt={itemName}
                fill
                sizes="128px"
                className="object-contain p-4 mix-blend-multiply"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
              <span className={order.status === "preparing" ? "text-black" : ""}>
                Preparing
              </span>
              <span className={order.status === "shipped" ? "text-black" : ""}>
                Shipped
              </span>
              <span className={order.status === "delivered" ? "text-black" : ""}>
                Delivered
              </span>
            </div>
            <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-[10px] sm:text-xs text-gray-500 font-medium space-y-1">
              <p>
                <span className="font-bold text-black uppercase tracking-wide">Order ID:</span> {order.orderId}
              </p>
              <p>
                <span className="font-bold text-black uppercase tracking-wide">Expected delivery:</span> {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderTrackingPage({ params }: Props) {
  const { orderId } = use(params);

  return (
    <Suspense fallback={
      <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
        <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
          <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <OrderTrackingContent orderId={orderId} />
    </Suspense>
  );
}
