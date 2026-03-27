import { create } from "zustand";
import { dispatchCursorPulse } from "@/lib/cursor-pulse";

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  isOpen: boolean;
  items: CartLine[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (p: { id: string; name: string; price: number }) => void;
  removeLine: (productId: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  items: [],
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  addItem: ({ id, name, price }) => {
    set((state) => {
      const idx = state.items.findIndex((i) => i.productId === id);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = {
          ...items[idx],
          quantity: items[idx].quantity + 1,
        };
        return { items };
      }
      return {
        items: [
          ...state.items,
          { productId: id, name, price, quantity: 1 },
        ],
      };
    });
    dispatchCursorPulse();
  },
  removeLine: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),
}));

export function selectCartTotal(items: CartLine[]) {
  return items.reduce((acc, i) => acc + i.price * i.quantity, 0);
}

export function selectCartCount(items: CartLine[]) {
  return items.reduce((acc, i) => acc + i.quantity, 0);
}
