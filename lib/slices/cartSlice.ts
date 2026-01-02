import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productId: number; // Changed from 'id' to match requirements
  name: string; // Changed from 'title' to match requirements
  price: number;
  quantity: number;
  imageUrl: string; // Changed from 'image' to match requirements
  // Keep backward compatibility
  id?: number;
  title?: string;
  image?: string;
};

export type ShippingOption = {
  id: string;
  date: string;
  label: string;
  price: number;
  isFree: boolean;
};

export type CartState = {
  items: CartItem[];
  selectedShipping: ShippingOption | null;
};

const initialState: CartState = {
  items: [],
  selectedShipping: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addToCart(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      // Support both old and new field names for compatibility
      const productId = action.payload.productId ?? action.payload.id!;
      const existing = state.items.find(
        (i) => i.productId === productId || i.id === productId
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        const newItem: CartItem = {
          productId,
          name: action.payload.name ?? action.payload.title ?? "",
          price: action.payload.price,
          imageUrl: action.payload.imageUrl ?? action.payload.image ?? "",
          quantity: 1,
        };
        state.items.push(newItem);
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) {
      const productId = action.payload.id;
      const item = state.items.find(
        (i) => i.productId === productId || i.id === productId
      );
      if (!item) return;
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter(
          (i) => i.productId !== productId && i.id !== productId
        );
      } else {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const productId = action.payload;
      state.items = state.items.filter(
        (i) => i.productId !== productId && i.id !== productId
      );
    },
    clearCart(state) {
      state.items = [];
      state.selectedShipping = null;
    },
    setShippingOption(state, action: PayloadAction<ShippingOption>) {
      state.selectedShipping = action.payload;
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setShippingOption,
} = cartSlice.actions;

export default cartSlice.reducer;


