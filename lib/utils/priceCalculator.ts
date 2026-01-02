import type { CartItem, ShippingOption } from "@/lib/slices/cartSlice";

export const TAX_RATE = 0.1; // 10% tax

export type PriceBreakdown = {
  itemsTotal: number;
  shippingCost: number;
  subtotal: number;
  tax: number;
  orderTotal: number;
  itemCount: number;
};

/**
 * Calculate item subtotal (price * quantity)
 */
export function calculateItemSubtotal(item: CartItem): number {
  return item.price * item.quantity;
}

/**
 * Calculate cart subtotal (sum of all item subtotals)
 */
export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
}

/**
 * Calculate total item count (sum of all quantities)
 */
export function calculateItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Calculate complete price breakdown for order
 */
export function calculatePriceBreakdown(
  items: CartItem[],
  shippingOption: ShippingOption | null
): PriceBreakdown {
  const itemsTotal = calculateCartSubtotal(items);
  const shippingCost = shippingOption?.price || 0;
  const subtotal = itemsTotal + shippingCost;
  const tax = itemsTotal * TAX_RATE; // Tax is calculated on items only, not shipping
  const orderTotal = subtotal + tax;
  const itemCount = calculateItemCount(items);

  return {
    itemsTotal,
    shippingCost,
    subtotal,
    tax,
    orderTotal,
    itemCount,
  };
}

