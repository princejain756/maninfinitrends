import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const newArrivals = [
  {
    id: 1,
    name: 'Banarasi Silk Saree',
    price: 8999,
    originalPrice: 12999,
    image: '/api/placeholder/300/400',
    rating: 4.8,
    reviews: 124,
    tag: 'Handwoven',
    inStock: true,
    category: 'Sarees'
  },
  {
    id: 2,
    name: 'Chanderi Cotton Kurti',
    price: 2499,
    originalPrice: 3499,
    image: '/api/placeholder/300/400',
    rating: 4.6,
    reviews: 89,
    tag: 'Limited Edition',
    inStock: true,
    category: 'Kurtis'
  },
  {
    id: 3,
    name: 'Bamboo Fiber Dupatta',
    price: 1299,
    originalPrice: null,
    image: '/api/placeholder/300/400',
    rating: 4.9,
    reviews: 56,
    tag: 'Eco-Friendly',
    inStock: true,
    category: 'Eco Collection'
  },
  {
    id: 4,
    name: 'Kundan Necklace Set',
    price: 3999,
    originalPrice: 5499,
    image: '/api/placeholder/300/400',
    rating: 4.7,
    reviews: 203,
    tag: 'Bestseller',
    inStock: false,
    category: 'Jewellery'
  },
  {
    id: 5,
    name: 'Ikat Print Palazzo Set',
    price: 3299,
    originalPrice: 4299,
    image: '/api/placeholder/300/400',
    rating: 4.5,
    reviews: 78,
    tag: 'New',
    inStock: true,
    category: 'Indo-Western'
  },
  {
    id: 6,
    name: 'Coffee Husk Handbag',
    price: 1899,
    originalPrice: null,
    image: '/api/placeholder/300/400',
    rating: 4.8,
    reviews: 34,
    tag: 'Sustainable',
    inStock: true,
    category: 'Accessories'
  },
  {
    id: 7,
    name: 'Kalamkari Dress Material',
    price: 2199,
    originalPrice: 2999,
    image: '/api/placeholder/300/400',
    rating: 4.6,
    reviews: 92,
    tag: 'Handblock',
    inStock: true,
    category: 'Fabrics'
  },
  {
    id: 8,
    name: 'Temple Jewellery Earrings',
    price: 1599,
    originalPrice: 2199,
    image: '/api/placeholder/300/400',
    rating: 4.9,
    reviews: 167,
    tag: 'Traditional',
    inStock: true,
    category: 'Jewellery'
  }
];

export const NewArrivals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const itemsToShow = 4;
  const maxIndex = Math.max(0, newArrivals.length - itemsToShow);

  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(maxIndex, currentIndex + 1);
    
    setCurrentIndex(newIndex);
  };

  const toggleWishlist = (productId: number) => {
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

                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <Button 
                        className="w-full btn-primary"
                        disabled={!product.inStock}
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