import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { CartSidebar } from '@/components/Cart/CartSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components/Product/ProductCard';
// Server-driven categories
import { fetchCategories, type CategoryDto } from '@/lib/categoriesApi';
import { fetchAllProducts } from '@/lib/productsApi';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL } from '@/config/seo';

const Shop = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    priceRange: [0, 50000],
    categories: category ? [category] : [],
    fabrics: [],
    colors: [],
    sizes: [],
    inStock: false
  });

  const [sortBy, setSortBy] = useState('relevance');
  const [allProducts, setAllProducts] = useState([] as import('@/types/product').Product[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesList, setCategoriesList] = useState<CategoryDto[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchAllProducts()
      .then((data) => {
        if (mounted) {
          setAllProducts(data);
          setLoading(false);
          // Expand price max to cover available products
          const maxPrice = Math.max(0, ...data.map(p => p.price || 0));
          setFilters((prev) => ({ ...prev, priceRange: [0, Math.max(50000, maxPrice)] }));
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e?.message || 'Failed to load products');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Load categories from server
  useEffect(() => {
    let mounted = true;
    setCategoriesLoading(true);
    fetchCategories()
      .then((data) => {
        if (mounted) {
          setCategoriesList(data);
          setCategoriesLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setCategoriesError(e?.message || 'Failed to load categories');
          setCategoriesLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category) ||
        filters.categories.includes(product.subcategory)
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.reviews.rating - a.reviews.rating);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.reviews.count - a.reviews.count);
        break;
    }

    return filtered;
  }, [filters, sortBy, allProducts]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <SeoHead
          title={category ? `Shop ${category.charAt(0).toUpperCase() + category.slice(1)} — Maninfini Trends` : 'Shop — Maninfini Trends'}
          description="Discover our curated collection of ethnic elegance and eco-smart style"
          canonicalPath={category ? `/shop/${category}` : '/shop'}
        />
        {/* Hero Section */}
        <section className="bg-gradient-subtle py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
                {category ? `Shop ${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Shop All'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our curated collection of ethnic elegance and eco-smart style
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb JSON-LD */}
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
                { '@type': 'ListItem', position: 2, name: 'Shop', item: `${BASE_URL}/shop` },
                ...(category
                  ? [{ '@type': 'ListItem', position: 3, name: category, item: `${BASE_URL}/shop/${category}` }]
                  : []),
              ],
            }}
          />
          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-64 space-y-6"
              >
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Categories</h3>
                  {categoriesLoading && (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  )}
                  {categoriesError && (
                    <p className="text-sm text-red-600">{categoriesError}</p>
                  )}
                  {!categoriesLoading && !categoriesError && (
                    <div className="space-y-3">
                      {categoriesList.map((cat) => (
                        <div key={cat.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={cat.id}
                              checked={filters.categories.includes(cat.slug)}
                              onCheckedChange={(checked) => {
                                const newCategories = checked
                                  ? [...filters.categories, cat.slug]
                                  : filters.categories.filter(c => c !== cat.slug);
                                handleFilterChange('categories', newCategories);
                              }}
                            />
                            <Label htmlFor={cat.id} className="text-sm capitalize">
                              {cat.name}
                            </Label>
                          </div>
                          <span className="text-xs text-muted-foreground">{cat.productCount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0]}
                        onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 50000])}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Availability</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                    />
                    <Label htmlFor="in-stock" className="text-sm">
                      In Stock Only
                    </Label>
                  </div>
                </Card>
              </motion.aside>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} of {allProducts.length} products
                </p>
                
                {filters.categories.length > 0 && (
                  <div className="flex items-center gap-2">
                    {filters.categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="gap-1">
                        {cat}
                        <button
                          onClick={() => {
                            const newCategories = filters.categories.filter(c => c !== cat);
                            handleFilterChange('categories', newCategories);
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {loading && (
                <div className="py-16 text-center text-muted-foreground">Loading products…</div>
              )}
              {error && (
                <div className="py-16 text-center text-red-600">{error}</div>
              )}
              {!loading && !error && (
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
              )}

              {!loading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={() => setFilters({
                    search: '',
                    priceRange: [0, 50000],
                    categories: [],
                    fabrics: [],
                    colors: [],
                    sizes: [],
                    inStock: false
                  })}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Shop;
