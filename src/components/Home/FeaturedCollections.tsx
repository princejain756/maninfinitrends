import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles, Crown, Shirt } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { fetchCategories } from '@/lib/categoriesApi';
import { fetchAllProducts } from '@/lib/productsApi';
import { useEffect, useMemo, useState } from 'react';
// Fallbacks for missing assets
import sareeIcon from '@/assets/icons/sareebg.png';
import salwarIcon from '@/assets/icons/salwarbg.png';
import kurtiIcon from '@/assets/icons/kurtisbg.png';
import indoIcon from '@/assets/icons/indo-westernbg.png';
import fabricsIcon from '@/assets/icons/fabricsbg.png';

// Try loading missing icons with local fallbacks if they don't exist
const drinkwareIcon = sareeIcon;
const accessoriesIcon = salwarIcon;
const bambooIcon = kurtiIcon;
const ecoCollectionIcon = fabricsIcon;
const jewelleryIcon = kurtiIcon;
const coffeeHuskIcon = kurtiIcon;
const riceHuskIcon = kurtiIcon;

type CollectionCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: typeof Crown;
  badge: string;
  color: 'primary' | 'secondary' | 'accent';
  href: string;
};

export const FeaturedCollections = () => {
  const [collections, setCollections] = useState<CollectionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([fetchCategories(), fetchAllProducts()])
      .then(([cats, prods]) => {
        if (!mounted) return;
        // Build a quick index of available product images per category
        const byCategory = new Map<string, string[]>();
        for (const p of prods) {
          const cat = p.category || p.subcategory;
          if (!cat) continue;
          const imgs = Array.isArray(p.images) ? p.images : [];
          for (const src of imgs) {
            if (!src) continue;
            // Skip explicit placeholders
            if (src.includes('/api/placeholder/')) continue;
            // Accept absolute http(s) and site-relative /uploads
            if (src.startsWith('http') || src.startsWith('/uploads/')) {
              const list = byCategory.get(cat) || [];
              if (list.length < 12) list.push(src); // keep it light
              byCategory.set(cat, list);
            }
          }
        }

        // Prefer categories that actually have products AND images
        const sorted = cats.slice().sort((a, b) => b.productCount - a.productCount);
        const withImages = sorted.filter((c) => c.productCount > 0 && (byCategory.get(c.slug)?.length || 0) > 0);
        const withProductsNoImages = sorted.filter((c) => c.productCount > 0 && !(byCategory.get(c.slug)?.length));
        // Final selection: up to 4 from withImages; if fewer exist, optionally fill from withProductsNoImages
        const chosen = [...withImages, ...withProductsNoImages].slice(0, 4);
        const curated: Record<string, string> = {
          'sarees': sareeIcon,
          'kurtis': kurtiIcon,
          'salwars': salwarIcon,
          'fabrics': fabricsIcon,
          'indo-western': indoIcon,
          'indo western': indoIcon,
          'accessories': accessoriesIcon,
          'eco-accessories': accessoriesIcon,
          'drinkware': drinkwareIcon,
          'bamboo': bambooIcon,
          'bamboo-products': bambooIcon,
          'bamboo-materials': bambooIcon,
          'bamboomaterials': bambooIcon,
          'materials-bamboo': bambooIcon,
          'eco-collection': ecoCollectionIcon,
          'eco': ecoCollectionIcon,
          'jewellery': jewelleryIcon,
          'jewelry': jewelleryIcon,
          'coffee-husk': coffeeHuskIcon,
          'coffee': coffeeHuskIcon,
          'rice-husk': riceHuskIcon,
          'rice': riceHuskIcon,
          'indo-western-wear': indoIcon,
          'kitchen': '/uploads/embroided round table mat.webp',
          'home-decor': '/uploads/floral pillow cover.webp',
        };

        const cards: CollectionCard[] = chosen.map((c, i) => {
          const pool = byCategory.get(c.slug) || [];
          const pick = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : (curated[c.slug] || 'ecoCollectionIcon');
          const icon = i === 0 ? Crown : i === 1 ? Shirt : i === 2 ? Sparkles : Leaf;
          const color: 'primary' | 'secondary' | 'accent' = i === 0 ? 'primary' : (i === 3 ? 'secondary' : 'accent');
          return {
            id: c.slug,
            title: c.name,
            description: `${c.productCount} ${c.productCount === 1 ? 'product' : 'products'}`,
            image: pick,
            icon,
            badge: i === 0 ? 'Bestseller' : i === 1 ? 'New' : i === 2 ? 'Trending' : 'Eco-Friendly',
            color,
            href: `/shop/${c.slug}`,
          };
        });
        setCollections(cards);
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

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

      {loading && <div className="text-center text-muted-foreground py-8">Loading…</div>}
      {error && <div className="text-center text-red-600 py-8">{error}</div>}
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
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
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
