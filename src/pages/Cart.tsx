import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { CartItem } from '@/components/Cart/CartItem';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart = () => {
  const { items, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
              <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover our beautiful collection of ethnic wear and eco-friendly products
              </p>
              <Button onClick={handleContinueShopping} className="btn-primary">
                Start Shopping
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-semibold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Items ({getTotalItems()})</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.productId}-${JSON.stringify(item.selectedVariant)}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CartItem item={item} />
                      {index < items.length - 1 && <Separator />}
                    </motion.div>
                  ))}
                </div>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleContinueShopping}>
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                {(() => {
                  const threshold = 999;
                  const subtotal = getTotalPrice();
                  const remaining = Math.max(0, threshold - subtotal);
                  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
                  return (
                    <div className="mb-4 p-3 rounded-xl bg-muted/50">
                      {remaining > 0 ? (
                        <>
                          <div className="text-sm mb-2">
                            You’re <span className="font-semibold">₹{remaining.toLocaleString()}</span> away from <span className="font-semibold">Free Shipping</span>
                          </div>
                          <Progress value={progress} />
                        </>
                      ) : (
                        <div className="text-sm text-emerald-700 font-medium">🎉 You’ve unlocked Free Shipping!</div>
                      )}
                    </div>
                  );
                })()}
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>GST (included)</span>
                    <span>₹{Math.round(getTotalPrice() * 0.05).toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  className="btn-primary w-full mt-6"
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Free shipping on orders over ₹999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>15-day easy returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Secure payment with Razorpay</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
