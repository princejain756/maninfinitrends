import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const { addItem, setCartOpen } = useCartStore();
  const [isWishlist, setIsWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setCartOpen(true);
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
      <Card className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 bg-white border-0" onClick={handleViewProduct}>
        <div className="flex gap-6 p-6">
          <div className="relative w-32 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-rose-500 text-white border-0 text-xs px-2 py-1">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-base line-clamp-1 mb-1 text-gray-900">{product.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{product.subcategory}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWishlist}
                  className={`p-2 hover:bg-transparent ${isWishlist ? 'text-rose-500' : 'text-gray-400'}`}
                >
                  <Heart className={`h-4 w-4 ${isWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{product.reviews.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviews.count})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <Button 
                size="sm" 
                onClick={handleAddToCart} 
                className="bg-gray-900 hover:bg-gray-800 text-white border-0 px-6"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden cursor-pointer group bg-white border-0 hover:shadow-2xl transition-all duration-500" onClick={handleViewProduct}>
        {/* Image Container - Minimal & Clean */}
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
          <img
            src={product.images[0]}
            alt={product.title}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Minimal Overlay (non-interactive so buttons remain clickable) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discountPercentage > 0 && (
              <Badge className="bg-white text-gray-900 border-0 text-xs px-2.5 py-1 font-medium shadow-sm">
                -{discountPercentage}%
              </Badge>
            )}
            {product.badges.includes('new-arrival') && (
              <Badge className="bg-emerald-500 text-white border-0 text-xs px-2.5 py-1 font-medium">
                New
              </Badge>
            )}
            {product.badges.includes('eco-friendly') && (
              <Badge className="bg-green-600 text-white border-0 text-xs px-2.5 py-1 font-medium">
                Eco
              </Badge>
            )}
          </div>

          {/* Wishlist Button - Minimal */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 z-10 ${
              isWishlist ? 'text-rose-500' : 'text-gray-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlist ? 'fill-current' : ''}`} />
          </Button>

          {/* Quick Add to Cart - Appears on Hover */}
          <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border-0 shadow-lg backdrop-blur-sm font-medium py-2.5"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info - Clean Typography */}
        <div className="p-4">
          <div className="mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">{product.subcategory}</p>
            <h3 className="font-medium text-base line-clamp-2 text-gray-900 mb-2 leading-snug group-hover:text-gray-700 transition-colors">
              {product.title}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{product.reviews.rating}</span>
            </div>
            <span className="text-xs text-gray-400">({product.reviews.count} reviews)</span>
          </div>

          {/* Price - Bold & Clear */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
