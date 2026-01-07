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
      <main className="bg-white min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-6">
            Your cart is empty
          </h1>
          <Link
            href="/"
            className="inline-block bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wider px-8 py-4 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            Checkout
          </h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">

            {/* Cart Items */}
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide mb-6">Your Items</h2>
              <div className="space-y-6">
                {items.map((item) => {
                  const itemId = item.productId || item.id!;
                  const itemName = item.name || item.title!;
                  const itemImage = item.imageUrl || item.image!;
                  return (

                    <div
                      key={itemId}
                      className="flex items-start gap-4 sm:gap-6 border-b border-gray-100 pb-6"
                    >
                      {/* Left Remove Icon */}
                      <button
                        onClick={() => dispatch(removeFromCart(itemId))}
                        className="mt-2 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-gray-50">
                        <Image
                          src={itemImage}
                          alt={itemName}
                          fill
                          sizes="96px"
                          className="object-contain p-2 mix-blend-multiply"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-h-[6rem]">
                        <div>
                          <h3 className="font-bold text-black text-sm sm:text-base uppercase tracking-wide leading-snug mb-2">
                            {itemName}
                          </h3>
                          <p className="text-lg font-bold text-black">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium mr-4 text-sm">Qty:</span>
                            <div className="flex items-center border border-gray-300 rounded-sm">
                              {/* Decrease */}
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    dispatch(updateQuantity({ id: itemId, quantity: item.quantity - 1 }));
                                  } else {
                                    dispatch(removeFromCart(itemId));
                                  }
                                }}
                                className="p-1 sm:p-2 text-black hover:bg-gray-100 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                </svg>
                              </button>

                              <span className="w-8 text-center text-sm font-bold text-black">
                                {item.quantity}
                              </span>

                              {/* Increase */}
                              <button
                                onClick={() =>
                                  dispatch(updateQuantity({ id: itemId, quantity: item.quantity + 1 }))
                                }
                                className="p-1 sm:p-2 text-black hover:bg-gray-100 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                })}
              </div>
            </div>

            {/* Shipping Options */}
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide mb-6">
                Delivery Method
              </h2>
              <div className="space-y-4">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-4 border p-4 transition-all ${selectedShipping?.id === option.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedShipping?.id === option.id ? "border-black" : "border-gray-400"
                      }`}>
                      {selectedShipping?.id === option.id && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                    </div>

                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShipping?.id === option.id}
                      onChange={() => dispatch(setShippingOption(option))}
                      className="hidden"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold uppercase tracking-wide text-black">
                        {option.label}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-black">
                      {option.isFree ? (
                        <span className="text-green-600">
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
            <div className="sticky top-24 bg-gray-50 p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-black uppercase tracking-wide text-black">
                Summary
              </h2>
              <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 uppercase tracking-wide font-medium">
                    {priceBreakdown.itemCount} Items
                  </span>
                  <span className="font-bold text-black">
                    ${priceBreakdown.itemsTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 uppercase tracking-wide font-medium">
                    Delivery
                  </span>
                  <span className="font-bold text-black">
                    ${priceBreakdown.shippingCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 uppercase tracking-wide font-medium">
                    Tax
                  </span>
                  <span className="font-bold text-black">
                    ${priceBreakdown.tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-black uppercase tracking-wide mb-8">
                <span className="text-black">Total</span>
                <span className="text-black">
                  ${priceBreakdown.orderTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || items.length === 0 || !currentShipping}
                className="w-full bg-black hover:bg-gray-900 px-6 py-4 text-sm font-bold text-white uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
              >
                {isPlacingOrder ? "Processing..." : "Place Order ->"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
