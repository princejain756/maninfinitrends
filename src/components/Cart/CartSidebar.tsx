import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { CartItem } from './CartItem';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartSidebar = () => {
  const { items, isOpen, setCartOpen, getTotalPrice, getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setCartOpen(false);
    navigate('/cart');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({getTotalItems()})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some beautiful items to your cart
            </p>
            <Button 
              onClick={() => {
                setCartOpen(false);
                navigate('/shop');
              }}
              className="btn-primary"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={`${item.productId}-${JSON.stringify(item.selectedVariant)}`} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleViewCart}
                  className="w-full"
                >
                  View Cart
                </Button>
                <Button 
                  onClick={handleCheckout}
                  className="btn-primary w-full"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};