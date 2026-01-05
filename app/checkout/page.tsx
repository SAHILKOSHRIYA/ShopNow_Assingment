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
import { addOrder } from "@/lib/slices/ordersSlice";
import { calculatePriceBreakdown } from "@/lib/utils/priceCalculator";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

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
      date: getDateString(1),
      label: `Early Delivery - ${getDateString(1)}`,
      price: 9.99,
      isFree: false,
    },
    {
      id: "standard",
      date: getDateString(3),
      label: `Standard Delivery - ${getDateString(3)}`,
      price: 4.99,
      isFree: false,
    },
    {
      id: "free",
      date: getDateString(5),
      label: `Free Delivery - ${getDateString(5)}`,
      price: 0,
      isFree: true,
    },
  ];
}


function getDefaultShippingOption(options: ShippingOption[]): ShippingOption {
  // Default to free delivery
  return options.find(opt => opt.isFree) || options[options.length - 1];
}

export default function CheckoutPage() {
  const items = useSelector((state: RootState) => state.cart.items);
  const selectedShipping = useSelector(
    (state: RootState) => state.cart.selectedShipping
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const shippingOptions = getShippingOptions();

 
  useEffect(() => {
    if (!selectedShipping && shippingOptions.length > 0) {
      const defaultOption = getDefaultShippingOption(shippingOptions);
      dispatch(setShippingOption(defaultOption));
    }
  }, [selectedShipping, shippingOptions, dispatch]);


  const currentShipping = selectedShipping || getDefaultShippingOption(shippingOptions);
  const priceBreakdown = calculatePriceBreakdown(items, currentShipping);

  const handlePlaceOrder = async () => {
 
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!currentShipping) {
      alert("Please select a delivery option!");
      return;
    }

    setIsPlacingOrder(true);

   
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
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      
      console.log("Order placed:", orderPayload);
      
      // Save order to Redux store
      dispatch(addOrder(orderPayload));
      
      // Clear cart
      dispatch(clearCart());
      
      // Navigate to success page
      window.location.href = `/orders/success`;
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="bg-[#EAEDED] min-h-screen flex flex-col items-center justify-center gap-4 px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
          <h1 className="text-2xl font-normal text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <Link
            href="/"
            className="inline-block rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-6 py-2 text-sm font-medium text-black transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#EAEDED] min-h-screen w-full overflow-x-hidden">
      <div className="w-full px-2 sm:px-3 py-2 sm:py-3">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-normal text-gray-900">
            Review your order
          </h1>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Delivery Date */}
          {selectedShipping && (
            <div className="border border-gray-200 bg-white rounded-sm p-3 sm:p-4">
              <p className="text-sm font-medium text-[#007185]">
                Delivery: {selectedShipping.label}
              </p>
            </div>
          )}

          {/* Cart Items */}
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => {
              const itemId = item.productId || item.id!;
              const itemName = item.name || item.title!;
              const itemImage = item.imageUrl || item.image!;
              return (
                <div
                  key={itemId}
                  className="flex gap-3 sm:gap-4 border border-gray-200 bg-white rounded-sm p-3 sm:p-4"
                >
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden bg-white">
                    <Image
                      src={itemImage}
                      alt={itemName}
                      fill
                      sizes="96px"
                      className="object-contain p-1 sm:p-2"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 sm:gap-2 min-w-0">
                    <h3 className="font-normal text-gray-900 text-xs sm:text-sm line-clamp-2">
                      {itemName}
                    </h3>
                    <p className="text-sm font-bold text-[#B12704]">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="mt-auto flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                      <span className="text-gray-600">
                        Qty: {item.quantity}
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
                        className="text-[#007185] hover:text-[#C7511F] hover:underline"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(itemId))}
                        className="text-red-600 hover:text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shipping Options */}
          <div className="border border-gray-200 bg-white rounded-sm p-3 sm:p-4">
            <h2 className="mb-3 sm:mb-4 text-sm font-semibold text-gray-900">
              Choose delivery option:
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 border border-gray-200 p-2 sm:p-3 rounded-sm transition hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={selectedShipping?.id === option.id}
                    onChange={() => dispatch(setShippingOption(option))}
                    className="h-4 w-4 text-[#FF9900] focus:ring-[#FF9900]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {option.label}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {option.isFree ? (
                      <span className="text-[#007185] font-semibold">
                        FREE
                      </span>
                    ) : (
                      `$${option.price.toFixed(2)}`
                    )}
                  </p>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 border border-gray-200 bg-white rounded-sm p-4 sm:p-6">
            <h2 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">
              Order Summary
            </h2>
            <div className="space-y-2 sm:space-y-3 border-b border-gray-200 pb-3 sm:pb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">
                  Items ({priceBreakdown.itemCount}):
                </span>
                <span className="text-gray-900">
                  ${priceBreakdown.itemsTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">
                  Shipping:
                </span>
                <span className="text-gray-900">
                  ${priceBreakdown.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">
                  Before tax:
                </span>
                <span className="text-gray-900">
                  ${priceBreakdown.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">
                  Tax (10%):
                </span>
                <span className="text-gray-900">
                  ${priceBreakdown.tax.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-base sm:text-lg font-semibold">
              <span className="text-[#B12704]">Total:</span>
              <span className="text-[#B12704]">
                ${priceBreakdown.orderTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || items.length === 0 || !currentShipping}
              className="mt-4 sm:mt-6 w-full rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-4 py-2.5 sm:py-3 text-sm font-medium text-black transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-300 disabled:border-gray-300"
            >
              {isPlacingOrder ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

