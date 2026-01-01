import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types/product'
import { api } from '@/lib/api'

type WishlistItem = {
  productId: string
  product: Product
  addedAt: number
}

type WishlistStore = {
  items: WishlistItem[]
  add: (product: Product) => void
  remove: (productId: string) => void
  toggle: (product: Product) => void
  clear: () => void
  mergeWithServer: () => Promise<void>
  syncFromServer: () => Promise<void>
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) => {
        const exists = get().items.some((i) => i.productId === product.id)
        if (exists) return
        set((state) => ({
          items: [
            ...state.items,
            { productId: product.id, product, addedAt: Date.now() },
          ],
        }))
      },
      remove: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }))
      },
      toggle: (product) => {
        const exists = get().items.some((i) => i.productId === product.id)
        if (exists) {
          get().remove(product.id)
        } else {
          get().add(product)
        }
        // Try to persist server-side when authenticated
        api('/api/wishlist/toggle', { method: 'POST', body: JSON.stringify({ productId: product.id }) }).catch(()=>{})
      },
      clear: () => set({ items: [] }),
      
      // Merge local wishlist with server (union). Requires user session.
      mergeWithServer: async () => {
        try {
          const ids = get().items.map(i => i.productId)
          await api('/api/wishlist/sync', { method: 'POST', body: JSON.stringify({ productIds: ids }) })
          // Then refresh from server authoritative state
          await get().syncFromServer()
        } catch {}
      },
      // Replace local wishlist with server copy
      syncFromServer: async () => {
        try {
          const prods = await api<any[]>('/api/wishlist')
          set({ items: prods.map(p => ({ productId: p.id, product: p, addedAt: Date.now() })) })
        } catch {}
      },
    }),
    { name: 'maninfini-wishlist' }
  )
)
