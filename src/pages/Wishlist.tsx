import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { ProductCard } from '@/components/Product/ProductCard'
import { Heart, ShoppingCart } from 'lucide-react'

const Wishlist = () => {
  const items = useWishlistStore((s) => s.items)
  const clear = useWishlistStore((s) => s.clear)
  const remove = useWishlistStore((s) => s.remove)
  const { addItem, setCartOpen } = useCartStore()

  const handleAddAllToCart = () => {
    items.forEach((it) => addItem(it.product, 1))
    setCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">My Wishlist</h1>
            {items.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleAddAllToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add all to cart
                </Button>
                <Button variant="ghost" onClick={() => clear()}>Clear</Button>
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <Card className="p-10 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Heart className="h-5 w-5" />
              </div>
              <div className="text-lg font-medium mb-1">No items saved yet</div>
              <div className="text-muted-foreground">Tap the heart icon on any product to add it here.</div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(({ productId, product }) => (
                <div key={productId} className="relative">
                  <div className="absolute right-2 top-2 z-10 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => { addItem(product, 1); setCartOpen(true); remove(productId); }}>
                      <ShoppingCart className="h-4 w-4 mr-1" /> Move to Cart
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(productId)}>Remove</Button>
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Wishlist
