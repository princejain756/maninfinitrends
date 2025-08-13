import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const bestsellers = [
  {
    id: 1,
    name: 'Royal Banarasi Silk Saree',
    price: 15999,
    originalPrice: 22999,
    image: '/api/placeholder/300/400',
    rating: 4.9,
    reviews: 342,
    sales: '1.2k+ sold',
    tag: 'Royal Collection',
    quickView: true,
    category: 'Sarees'
  },
  {
    id: 2,
    name: 'Heritage Kundan Choker',
    price: 4999,
    originalPrice: 7499,
    image: '/api/placeholder/300/400',
    rating: 4.8,
    reviews: 456,
    sales: '800+ sold',
    tag: 'Heritage',
    quickView: true,
    category: 'Jewellery'
  },
  {
    id: 3,
    name: 'Bamboo Silk Kurti Set',
    price: 3299,
    originalPrice: 4599,
    image: '/api/placeholder/300/400',
    rating: 4.7,
    reviews: 178,
    sales: '600+ sold',
    tag: 'Eco-Premium',
    quickView: true,
    category: 'Eco Collection'
  },
  {
    id: 4,
    name: 'Chanderi Palazzo Set',
    price: 2899,
    originalPrice: 3899,
    image: '/api/placeholder/300/400',
    rating: 4.6,
    reviews: 234,
    sales: '500+ sold',
    tag: 'Comfort Fit',
    quickView: true,
    category: 'Indo-Western'
  },
  {
    id: 5,
    name: 'Temple Jewellery Suite',
    price: 6999,
    originalPrice: 9999,
    image: '/api/placeholder/300/400',
    rating: 4.9,
    reviews: 167,
    sales: '400+ sold',
    tag: 'Bridal Choice',
    quickView: true,
    category: 'Jewellery'
  },
  {
    id: 6,
    name: 'Handblock Print Dress',
    price: 2199,
    originalPrice: 2999,
    image: '/api/placeholder/300/400',
    rating: 4.5,
    reviews: 89,
    sales: '350+ sold',
    tag: 'Artisan Made',
    quickView: true,
    category: 'Indo-Western'
  }
];

export const Bestsellers = () => {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full border border-accent/20 text-sm font-medium mb-6">
          <TrendingUp className="h-4 w-4 text-accent" />
          <span className="text-accent">Customer Favorites</span>
        </div>
        
        <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
          Bestselling Pieces
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our most loved pieces, chosen by thousands of satisfied customers. 
          These timeless designs combine traditional craftsmanship with contemporary appeal.
        </p>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {bestsellers.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ y: -8 }}
            className="group cursor-pointer"
          >
            <Card className="card-premium overflow-hidden h-full">
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
                    <button className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Button className="w-full btn-primary">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Quick Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-accent text-accent-foreground">
                    {product.tag}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>

                {/* Sales Badge */}
                <div className="absolute bottom-4 left-4 opacity-90">
                  <Badge className="bg-card/90 backdrop-blur-sm text-foreground border border-border/50">
                    🔥 {product.sales}
                  </Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {product.category}
                  </p>
                </div>
                
                <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs">
                      Bestseller
                    </Badge>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-xl text-foreground">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Social Proof */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>⭐ Highly rated</span>
                  <span>🚚 Free shipping</span>
                  <span>📦 Ready to ship</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-16"
      >
        <Button variant="outline" className="px-8 py-3 text-lg bg-card/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground">
          View All Bestsellers
          <TrendingUp className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </section>
  );
};