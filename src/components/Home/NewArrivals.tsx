import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { products as allProducts } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

type NAItem = {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  tag: string;
  inStock: boolean;
  category: string;
};

const toTag = (badges: string[] = []): string => {
  if (badges.includes('eco-friendly')) return 'Eco-Friendly';
  if (badges.includes('bestseller')) return 'Bestseller';
  if (badges.includes('new-arrival')) return 'New';
  if (badges.includes('handcrafted')) return 'Handcrafted';
  return 'New';
};

const hasRealImage = (imgs?: string[]) => !!imgs && imgs.length > 0 && !imgs[0].includes('/api/placeholder');

const newArrivals: NAItem[] = allProducts
  .filter(p => hasRealImage(p.images))
  .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
  .slice(0, 8)
  .map(p => ({
    id: p.id,
    name: p.title,
    price: p.price,
    originalPrice: p.compareAtPrice ?? null,
    image: p.images[0],
    rating: p.reviews.rating,
    reviews: p.reviews.count,
    tag: toTag(p.badges),
    inStock: (p.stock ?? 0) > 0,
    category: p.subcategory || p.category,
  }));

export const NewArrivals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addItem, setCartOpen } = useCartStore();

  const itemsToShow = 4;
  const maxIndex = Math.max(0, newArrivals.length - itemsToShow);

  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(maxIndex, currentIndex + 1);
    
    setCurrentIndex(newIndex);
  };

  const handleQuickAdd = (productId: string) => {
    const full = allProducts.find(p => p.id === productId);
    if (!full) return;
    addItem(full, 1);
    setCartOpen(true);
    toast.success('Added to cart!');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'eco-friendly':
      case 'sustainable':
        return 'bg-secondary text-secondary-foreground';
      case 'bestseller':
      case 'handwoven':
        return 'bg-primary text-primary-foreground';
      case 'new':
      case 'limited edition':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">
            New Arrivals
          </h2>
          <p className="text-muted-foreground">
            Fresh designs added weekly • Handpicked by our curators
          </p>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden md:flex items-center gap-2"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={currentIndex === 0}
            className="rounded-full w-10 h-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={currentIndex >= maxIndex}
            className="rounded-full w-10 h-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Products Carousel */}
      <div className="relative overflow-hidden">
        <motion.div
          ref={scrollContainerRef}
          className="flex gap-6"
          animate={{ x: `-${currentIndex * (100 / itemsToShow)}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ width: `${(newArrivals.length / itemsToShow) * 100}%` }}
        >
          {newArrivals.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: `${100 / newArrivals.length}%` }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-premium overflow-hidden group">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${product.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            wishlist.includes(product.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-10">
                      <Button 
                        className="w-full btn-primary"
                        disabled={!product.inStock}
                        onClick={(e) => { e.stopPropagation(); if (product.inStock) handleQuickAdd(product.id); }}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>

                  {/* Tag */}
                  <div className="absolute top-4 left-4">
                    <Badge className={getTagColor(product.tag)}>
                      {product.tag}
                    </Badge>
                  </div>

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="outline" className="bg-card/90 backdrop-blur-sm">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {product.category}
                    </p>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-foreground">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile Scroll Indicators */}
      <div className="flex justify-center mt-8 md:hidden">
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(newArrivals.length / 2) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / 2) === index 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
              onClick={() => setCurrentIndex(index * 2)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
