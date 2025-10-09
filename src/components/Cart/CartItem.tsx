import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { CartItem as CartItemType } from '@/types/product';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-start gap-4 py-4">
      <div className="relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden bg-muted">
        <img
          src={item.product.images[0]}
          alt={item.product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">
          {item.product.title}
        </h4>
        
        {item.selectedVariant && (
          <div className="text-xs text-muted-foreground mb-2">
            {Object.entries(item.selectedVariant).map(([key, value]) => (
              <span key={key} className="mr-2">
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-medium text-sm">
              ₹{(item.product.price * item.quantity).toLocaleString()}
            </div>
            {item.product.compareAtPrice && (
              <div className="text-xs text-muted-foreground line-through">
                ₹{(item.product.compareAtPrice * item.quantity).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        onClick={() => removeItem(item.productId)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};