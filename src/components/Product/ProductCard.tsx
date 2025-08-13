import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const [isWishlist, setIsWishlist] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success('Added to cart!');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleViewProduct = () => {
    navigate(`/product/${product.handle}`);
  };

  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <Card className="card-premium overflow-hidden cursor-pointer group" onClick={handleViewProduct}>
        <div className="flex gap-6 p-6">
          <div className="relative w-32 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1 mb-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground capitalize">{product.subcategory}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWishlist}
                className={`p-2 ${isWishlist ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <Heart className={`h-4 w-4 ${isWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.shortDescription}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.reviews.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviews.count})</span>
              </div>
              {product.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge.replace('-', ' ')}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">GST included</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleViewProduct}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button size="sm" onClick={handleAddToCart} className="btn-primary">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-premium overflow-hidden cursor-pointer group" onClick={handleViewProduct}>
        <div className="relative aspect-[3/4] bg-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={handleViewProduct}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleAddToCart} className="btn-primary">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleWishlist}
                className={isWishlist ? 'text-red-500' : ''}
              >
                <Heart className={`h-4 w-4 ${isWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.badges.includes('new-arrival') && (
              <Badge className="bg-primary text-primary-foreground">
                New
              </Badge>
            )}
            {product.badges.includes('eco-friendly') && (
              <Badge className="bg-green-500 text-white">
                Eco
              </Badge>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
              Only {product.stock} left
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
              Out of Stock
            </Badge>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold line-clamp-2 mb-1">{product.title}</h3>
              <p className="text-sm text-muted-foreground capitalize">{product.subcategory}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.reviews.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviews.count})</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">GST included</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};