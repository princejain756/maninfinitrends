import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, quantity = 1, variant) => {
        const existingItem = get().items.find(
          (item) => item.productId === product.id && 
          JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
        );
        
        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.productId === product.id && 
              JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { 
              productId: product.id, 
              product, 
              quantity, 
              selectedVariant: variant 
            }],
          }));
        }
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      
      setCartOpen: (open) => {
        set({ isOpen: open });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },
    }),
    {
      name: 'maninfini-cart',
    }
  )
);