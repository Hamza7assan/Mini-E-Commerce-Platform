import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  name: string;
  price: number; 
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string | number, size: string, color: string) => void;
  updateQuantity: (id: string | number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
  isOpen: false,
  items: [],
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ items: [] }),
  
  
  addItem: (newItem) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
      );
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...newItem, quantity: 1 }] };
    }),

  
  removeItem: (id, size, color) =>
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.id === id && item.size === size && item.color === color)
      ),
    })),

  
  updateQuantity: (id, size, color, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    })),
    }),
    { name: 'medwear-cart' }
  )
);
