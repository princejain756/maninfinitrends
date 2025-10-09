import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { CartSidebar } from '@/components/Cart/CartSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart';
import { Heart, Share2, ShoppingCart, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Maximize2, Eye, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL, BRAND } from '@/config/seo';

const ProductDetail = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  const [viewers, setViewers] = useState<number>(() => 12 + Math.floor(Math.random() * 24));

  // Shipping cutoff countdown (5:00 PM local time)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(17, 0, 0, 0);
      if (now > cutoff) {
        cutoff.setDate(cutoff.getDate() + 1);
      }
      const diff = cutoff.getTime() - now.getTime();
      const h = String(Math.floor(diff / 1000 / 3600)).padStart(2, '0');
      const m = String(Math.floor((diff / 1000 % 3600) / 60)).padStart(2, '0');
      const s = String(Math.floor(diff / 1000 % 60)).padStart(2, '0');
      setCountdown(`${h}:${m}:${s}`);
    };
    updateCountdown();
    const id = setInterval(updateCountdown, 1000);
    return () => clearInterval(id);
  }, []);

  // Live viewers simulation (ethical nudge)
  useEffect(() => {
    const id = setInterval(() => {
      setViewers((v) => {
        const delta = Math.random() < 0.5 ? -1 : 1;
        const nv = Math.min(48, Math.max(10, v + delta));
        return nv;
      });
    }, 20000 + Math.random() * 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const foundProduct = products.find(p => p.handle === handle);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/404');
    }
  }, [handle, navigate]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariants);
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedVariants);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const relatedProducts = products.filter(p => 
    p.id !== product.id && 
    (p.category === product.category || product.relatedIds.includes(p.id))
  ).slice(0, 4);

  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={product.seo?.title || `${product.title} — ${BRAND}`}
        description={product.seo?.description || product.shortDescription}
        canonicalPath={`/product/${product.handle}`}
        image={product.images?.[0] && product.images[0].startsWith('http') ? product.images[0] : undefined}
      />
      <Header />
      
      <main className="pt-20 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* JSON-LD: Breadcrumb + Product */}
          <JsonLd
            data={[
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
                  { '@type': 'ListItem', position: 2, name: 'Shop', item: `${BASE_URL}/shop` },
                  { '@type': 'ListItem', position: 3, name: product.category, item: `${BASE_URL}/shop/${product.category}` },
                  { '@type': 'ListItem', position: 4, name: product.title, item: `${BASE_URL}/product/${product.handle}` },
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.title,
                image: product.images.map((src) => (src.startsWith('http') ? src : `${BASE_URL}${src}`)),
                description: product.shortDescription || product.description,
                sku: product.sku,
                brand: { '@type': 'Brand', name: BRAND },
                url: `${BASE_URL}/product/${product.handle}`,
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'INR',
                  price: product.price,
                  availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                  url: `${BASE_URL}/product/${product.handle}`,
                  itemCondition: 'https://schema.org/NewCondition',
                },
                aggregateRating: product.reviews?.count
                  ? {
                      '@type': 'AggregateRating',
                      ratingValue: product.reviews.rating,
                      reviewCount: product.reviews.count,
                    }
                  : undefined,
              },
            ]}
          />
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8">
            <button onClick={() => navigate('/')} className="hover:text-foreground">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate('/shop')} className="hover:text-foreground">Shop</button>
            <span className="mx-2">/</span>
            <button onClick={() => navigate(`/shop/${product.category}`)} className="hover:text-foreground capitalize">
              {product.category}
            </button>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden group">
                <motion.img
                  key={selectedImageIndex}
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setIsImageZoomed(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Navigation arrows */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Zoom icon */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsImageZoomed(true)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discountPercentage > 0 && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                  {product.badges.map(badge => (
                    <Badge key={badge} variant="secondary">
                      {badge.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">{product.subcategory}</Badge>
                  {product.stock <= 5 && product.stock > 0 && (
                    <Badge variant="destructive">Only {product.stock} left</Badge>
                  )}
                </div>
                
                <h1 className="text-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
                  {product.title}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= product.reviews.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-medium ml-2">{product.reviews.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews.count} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <Badge className="bg-green-500 text-white">
                      Save {discountPercentage}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Inclusive of all taxes | GST: {(product.taxRate * 100).toFixed(0)}%
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Truck className="h-4 w-4" />
                    Order in <span className="font-medium">{countdown}</span> for dispatch today
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {viewers} viewing now
                  </span>
                </div>
              </div>

              {/* Variants/Attributes */}
              {Object.keys(product.attributes).length > 0 && (
                <div className="space-y-4">
                  {product.attributes.sizes && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Size</Label>
                        <button
                          type="button"
                          onClick={() => {
                            const ev = new CustomEvent('mnf:chat-open', { detail: { step: 'size' } });
                            window.dispatchEvent(ev);
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          Find my size
                        </button>
                      </div>
                      <Select 
                        value={selectedVariants.size || ''} 
                        onValueChange={(value) => setSelectedVariants(prev => ({ ...prev, size: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.attributes.sizes.split(', ').map((size: string) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="btn-primary flex-1" 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                  >
                    Buy Now
                  </Button>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={handleWishlist}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isWishlist ? 'fill-current text-red-500' : ''}`} />
                    {isWishlist ? 'Saved' : 'Save for Later'}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders ₹999+</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">15-day return</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="care">Care Instructions</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <Card className="p-6">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-lg leading-relaxed">{product.description}</p>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="care" className="mt-6">
                <Card className="p-6">
                  {product.care && product.care.length > 0 ? (
                    <ul className="space-y-2">
                      {product.care.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No specific care instructions available.</p>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <Card className="p-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">Customer Reviews</h3>
                    <p className="text-muted-foreground">Reviews functionality coming soon...</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-8">You might also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct.handle}`)}
                  >
                    <Card className="card-premium overflow-hidden">
                      <div className="aspect-square bg-muted">
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium line-clamp-2 mb-2">{relatedProduct.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">
                            ₹{relatedProduct.price.toLocaleString()}
                          </span>
                          {relatedProduct.compareAtPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{relatedProduct.compareAtPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartSidebar />
      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 lg:hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{product.title}</div>
            <div className="text-primary font-semibold">₹{product.price.toLocaleString()}</div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</Button>
          <div className="w-8 text-center text-sm font-medium">{quantity}</div>
          <Button size="sm" variant="outline" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>+</Button>
          <Button className="btn-primary" onClick={handleAddToCart}><ShoppingCart className="h-4 w-4 mr-1" /> Add</Button>
          <Button variant="outline" onClick={handleBuyNow}>Buy</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
