"use client";

import { Provider } from "react-redux";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { makeStore } from "@/lib/store";
import type { AppStore } from "@/lib/store";
import { hydrateCart } from "@/lib/slices/cartSlice";
import type { CartItem } from "@/lib/slices/cartSlice";
import { setOrders } from "@/lib/slices/ordersSlice";
import type { Order } from "@/lib/slices/ordersSlice";

const CART_COOKIE_KEY = "ecommerce_cart_v1";
const CART_LOCALSTORAGE_KEY = "ecommerce_cart_v1";
const ORDERS_LOCALSTORAGE_KEY = "ecommerce_orders_v1";

function loadCartFromStorage(): CartItem[] {
  // Try localStorage first, then cookies
  if (typeof window !== "undefined") {
    try {
      const localData = localStorage.getItem(CART_LOCALSTORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore invalid localStorage
    }
  }

  try {
    const cookieData = Cookies.get(CART_COOKIE_KEY);
    if (cookieData) {
      const parsed = JSON.parse(cookieData);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore invalid cookie
  }

  return [];
}

function saveCartToStorage(items: CartItem[]) {
  const data = JSON.stringify(items);
  
  // Save to localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_LOCALSTORAGE_KEY, data);
    } catch {
      // ignore localStorage errors
    }
  }

  // Save to cookies as backup
  try {
    Cookies.set(CART_COOKIE_KEY, data, {
      expires: 7,
    });
  } catch {
    // ignore cookie errors
  }
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    // Hydrate cart from storage on mount
    const savedItems = loadCartFromStorage();
    if (savedItems.length > 0) {
      storeRef.current?.dispatch(hydrateCart(savedItems));
    }

    // Hydrate orders from storage on mount
    if (typeof window !== "undefined") {
      try {
        const ordersData = localStorage.getItem(ORDERS_LOCALSTORAGE_KEY);
        if (ordersData) {
          const parsed = JSON.parse(ordersData);
          if (Array.isArray(parsed)) {
            storeRef.current?.dispatch(setOrders(parsed));
          }
        }
      } catch {
        // ignore invalid localStorage
      }
    }

    // Subscribe to state changes and persist
    const unsubscribe = storeRef.current?.subscribe(() => {
      const state = storeRef.current!.getState();
      const cartItems = state.cart.items;
      saveCartToStorage(cartItems);
      
      // Save orders to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(ORDERS_LOCALSTORAGE_KEY, JSON.stringify(state.orders.orders));
        } catch {
          // ignore localStorage errors
        }
      }
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return <Provider store={storeRef.current!}>{children}</Provider>;
}
