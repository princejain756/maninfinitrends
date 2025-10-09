import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles, Crown, Shirt } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';

const ecoPreview = products.find(p => p.category === 'eco' && p.images?.length);

const collections = [
  {
    id: 'sarees',
    title: 'Premium Sarees',
    description: 'Handwoven silk and cotton sarees with intricate zari work',
    image: '/api/placeholder/400/500',
    icon: Crown,
    badge: 'Bestseller',
    color: 'primary',
    href: '/collections/sarees'
  },
  {
    id: 'kurtis',
    title: 'Designer Kurtis',
    description: 'Contemporary cuts with traditional embroidery',
    image: '/api/placeholder/400/500',
    icon: Shirt,
    badge: 'New Arrivals',
    color: 'accent',
    href: '/collections/kurtis'
  },
  {
    id: 'jewellery',
    title: 'Imitation Jewellery',
    description: 'Exquisite pieces crafted with attention to detail',
    image: '/api/placeholder/400/500',
    icon: Sparkles,
    badge: 'Trending',
    color: 'accent',
    href: '/collections/jewellery'
  },
  {
    id: 'eco',
    title: 'Eco Home & Living',
    description: 'Planters, tableware and drinkware made from bio-composites',
    image: ecoPreview?.images?.[0] || '/api/placeholder/400/500',
    icon: Leaf,
    badge: 'Eco-Friendly',
    color: 'secondary',
    href: '/eco-collection'
  }
];

export const FeaturedCollections = () => {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
          Curated Collections
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our handpicked selection of premium ethnic wear, sustainable fashion, 
          and exquisite accessories that celebrate Indian craftsmanship.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {collections.map((collection, index) => {
          const Icon = collection.icon;
          
          return (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ y: -8 }}
              className="cursor-pointer"
            >
              <Link to={collection.href} className="block group" aria-label={`Explore ${collection.title}`}>
              <Card className="card-premium overflow-hidden h-full">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${collection.image}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={`
                      ${collection.color === 'primary' ? 'bg-primary text-primary-foreground' :
                        collection.color === 'secondary' ? 'bg-secondary text-secondary-foreground' :
                        'bg-accent text-accent-foreground'}
                    `}>
                      {collection.badge}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center justify-between bg-card/95 backdrop-blur-sm rounded-xl px-4 py-3 border border-border/50">
                      <span className="font-medium text-sm">Explore Collection</span>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {collection.description}
                  </p>
                </div>
              </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View All CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-12"
      >
        <button className="group inline-flex items-center gap-3 text-lg font-medium text-primary hover:text-primary/80 transition-colors">
          <span>View All Collections</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </section>
  );
};
