import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/product';
import { api } from '@/lib/api';

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

        // Fire-and-forget server cart sync for the added product
        // Backend will resolve to primary variant for the product.
        api('/api/cart/items', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity, options: variant || undefined })
        })
          .then(async (res) => {
            // attach server item id to the matching local cart line
            try {
              const json = await (res as any)?.json?.() ?? (res as any);
              const serverItemId = (json && json.item && json.item.id) ? json.item.id : undefined;
              if (serverItemId) {
                set((state) => ({
                  items: state.items.map((it) =>
                    it.productId === product.id && JSON.stringify(it.selectedVariant) === JSON.stringify(variant)
                      ? { ...it, serverItemId }
                      : it
                  ),
                }));
              }
            } catch {}
          })
          .catch(() => {/* ignore */});
      },
      
      removeItem: (productId) => {
        const toRemove = get().items.filter((i) => i.productId === productId && i.serverItemId);
        // Optimistic update
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) }));
        // Delete server items directly when ids are known; else fallback to sync
        if (toRemove.length > 0) {
          toRemove.forEach((i) => {
            if (i.serverItemId) {
              api(`/api/cart/items/${i.serverItemId}`, { method: 'DELETE' }).catch(()=>{});
            }
          });
        } else {
          const items = get().items.map((it) => ({ productId: it.productId, quantity: it.quantity }));
          api('/api/cart/sync', { method: 'POST', body: JSON.stringify({ items, replace: true }) }).catch(()=>{});
        }
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
        // Directly patch server cart line if we know its id
        const line = get().items.find((i) => i.productId === productId && i.serverItemId);
        if (line?.serverItemId) {
          api(`/api/cart/items/${line.serverItemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }).catch(()=>{});
        } else {
          // Fallback to syncing the whole cart
          const payload = {
            items: get().items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
            replace: true as const,
          };
          api('/api/cart/sync', { method: 'POST', body: JSON.stringify(payload) }).catch(()=>{});
        }
      },
      
      clearCart: () => {
        set({ items: [] });
        api('/api/cart/sync', { method: 'POST', body: JSON.stringify({ items: [], replace: true }) }).catch(()=>{});
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
