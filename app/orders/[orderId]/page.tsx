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
      <main className="bg-[#EAEDED] min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
            <h1 className="text-xl font-normal text-gray-900 mb-4">Order not found</h1>
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
      <main className="bg-[#EAEDED] min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
            <h1 className="text-xl font-normal text-gray-900 mb-4">Item not found</h1>
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
  // deliveryOption.date is already a formatted string like "Wednesday, January 14"
  const formattedDate = order.deliveryOption.date;

  // Determine progress based on status
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
    <main className="bg-[#EAEDED] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="inline-block text-[#007185] hover:text-[#C7511F] hover:underline text-sm mb-4"
        >
          View all orders
        </Link>

        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <h1 className="text-2xl font-normal text-gray-900 mb-4">
            Arriving on {formattedDate}
          </h1>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">{itemName}</h2>
            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <Image
                src={itemImage}
                alt={itemName}
                fill
                sizes="192px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span className={order.status === "preparing" ? "font-medium text-gray-900" : ""}>
                Preparing
              </span>
              <span className={order.status === "shipped" ? "font-medium text-gray-900" : ""}>
                Shipped
              </span>
              <span className={order.status === "delivered" ? "font-medium text-gray-900" : ""}>
                Delivered
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <span className="font-medium">Order ID:</span> {order.orderId}
              </p>
              <p>
                <span className="font-medium">Expected delivery:</span> {formattedDate}
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
      <main className="bg-[#EAEDED] min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <OrderTrackingContent orderId={orderId} />
    </Suspense>
  );
}

