import { useRef, useState, type MouseEvent, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchAllProducts } from '@/lib/productsApi';
import type { Product } from '@/types/product';
// Temporarily avoid store interactions here to rule out feedback loops
import { useNavigate } from 'react-router-dom';

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
  handle: string;
};

const toTag = (badges: string[] = []): string => {
  if (badges.includes('eco-friendly')) return 'Eco-Friendly';
  if (badges.includes('bestseller')) return 'Bestseller';
  if (badges.includes('new-arrival')) return 'New';
  if (badges.includes('handcrafted')) return 'Handcrafted';
  return 'New';
};

const hasRealImage = (imgs?: string[]) => !!imgs && imgs.length > 0 && !imgs[0].includes('/api/placeholder');

export const NewArrivals = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<NAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const itemsToShow = 4;
  const maxIndex = Math.max(0, items.length - itemsToShow);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchAllProducts()
      .then((data) => {
        if (!mounted) return;
        try {
          setAllProducts(data);
          const safe = Array.isArray(data) ? data : [];
          const mapped: NAItem[] = safe
            .filter((p:any) => hasRealImage(p?.images))
            .sort((a:any, b:any) => String(b?.createdAt||'').localeCompare(String(a?.createdAt||'')))
            .slice(0, 8)
            .map((p:any) => ({
              id: String(p?.id||''),
              name: String(p?.title||'Product'),
              price: Number(p?.price||0),
              originalPrice: p?.compareAtPrice ? Number(p.compareAtPrice) : null,
              image: String((p?.images||['/api/placeholder/600/600'])[0]),
              rating: Number(p?.reviews?.rating||0),
              reviews: Number(p?.reviews?.count||0),
              tag: toTag((p?.badges as any[])?.map(String) || []),
              inStock: Number(p?.stock||0) > 0,
              category: String(p?.subcategory || p?.category || ''),
              handle: String(p?.handle||''),
            }));
          setItems(mapped);
        } catch (err:any) {
          setError(err?.message || 'Failed to prepare products');
        } finally {
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(maxIndex, currentIndex + 1);
    
    setCurrentIndex(newIndex);
  };

  const handleViewProduct = (e: MouseEvent<HTMLButtonElement>, handle: string) => {
    e.stopPropagation();
    navigate(`/product/${handle}`);
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
        <div>
          <h2 className="text-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">
            New Arrivals
          </h2>
          <p className="text-muted-foreground">
            Fresh designs added weekly • Handpicked by our curators
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:flex items-center gap-2">
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
        </div>
      </div>

      {/* Products Carousel */}
      {loading && (
        <div className="text-center text-muted-foreground py-8">Loading…</div>
      )}
      {error && (
        <div className="text-center text-red-600 py-8">{error}</div>
      )}
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-6"
          style={{ 
            width: `${Math.max(1, items.length / itemsToShow) * 100}%`,
            transform: items.length > itemsToShow 
              ? `translateX(-${currentIndex * (100 / itemsToShow)}%)` 
              : 'translateX(0%)',
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {items.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: `${100 / Math.max(items.length, 1)}%` }}
            >
              <Card className="card-premium overflow-hidden group">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${product.image}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />

                  {/* Simple CTA */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-10">
                    <Button className="w-full btn-primary" onClick={(e) => handleViewProduct(e, product.handle)}>
                      View Details
                    </Button>
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
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Scroll Indicators */}
      <div className="flex justify-center mt-8 md:hidden">
        <div className="flex gap-2">
          {Array.from({ length: Math.max(1, Math.ceil(items.length / 2)) }).map((_, index) => (
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
