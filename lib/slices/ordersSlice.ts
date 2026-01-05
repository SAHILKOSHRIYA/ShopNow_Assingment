import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, ShippingOption } from "./cartSlice";

export type Order = {
  orderId: string;
  orderDate: string;
  items: CartItem[];
  deliveryOption: ShippingOption;
  pricing: {
    itemsTotal: number;
    shippingCost: number;
    tax: number;
    orderTotal: number;
  };
  status: "preparing" | "shipped" | "delivered";
};

export type OrdersState = {
  orders: Order[];
};

const initialState: OrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Omit<Order, "orderId" | "orderDate" | "status">>) {
      const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const orderDate = new Date().toISOString();
      const newOrder: Order = {
        ...action.payload,
        orderId,
        orderDate,
        status: "preparing",
      };
      state.orders.unshift(newOrder); // Add to beginning of array
    },
    updateOrderStatus(
      state,
      action: PayloadAction<{ orderId: string; status: Order["status"] }>
    ) {
      const order = state.orders.find((o) => o.orderId === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    cancelOrder(state, action: PayloadAction<string>) {
      // Remove cancelled orders
      state.orders = state.orders.filter((o) => o.orderId !== action.payload);
    },
  },
});

export const { addOrder, updateOrderStatus, setOrders, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;


