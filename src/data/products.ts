import { Product, Collection, Category } from '@/types/product';
import { generatedProducts } from './new_products.generated';

// Helper: choose eco products for dedicated collection
const ecoProductIds: string[] = generatedProducts.map(p => p.id);
const ecoCollectionImage: string = generatedProducts[0]?.images?.[0] || '/api/placeholder/800/600';

export const products: Product[] = [
  // Bags & Accessories
  {
    id: 'bag-001',
    title: 'Brown Velvet Potli Bag with Beaded Handle',
    handle: 'brown-velvet-potli-bag',
    sku: 'BAG-001',
    category: 'accessories',
    subcategory: 'bags',
    price: 1299,
    compareAtPrice: 1699,
    taxRate: 0.05,
    stock: 20,
    images: [
      new URL('@/assets/products/Brown velvet potli bag with beaded handle.webp', import.meta.url).href,
      new URL('@/assets/products/Brown velvet potli bag with beaded handle1.webp', import.meta.url).href,
      new URL('@/assets/products/Brown velvet potli bag with beaded handle2.webp', import.meta.url).href
    ],
    description: 'Elegant brown velvet potli bag with intricate beaded handle. Perfect for weddings and festive occasions. Handcrafted with premium materials.',
    shortDescription: 'Velvet potli with beaded handle',
    attributes: {
      material: 'Velvet',
      closure: 'Drawstring',
      occasion: 'Wedding, Party',
      care: 'Spot clean only'
    },
    care: ['Spot clean only', 'Store in dust bag', 'Avoid moisture'],
    badges: ['handcrafted', 'bestseller'],
    relatedIds: [],
    reviews: { rating: 4.9, count: 85 },
    seo: {
      title: 'Brown Velvet Potli Bag - Handcrafted Ethnic Bag',
      description: 'Shop handcrafted brown velvet potli bag with beaded handle. Perfect for weddings and festive occasions.',
      keywords: ['potli bag', 'velvet bag', 'ethnic bag', 'wedding bag']
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'bag-002',
    title: 'Art Canvas Tote Bag',
    handle: 'art-canvas-tote-bag',
    sku: 'BAG-002',
    category: 'accessories',
    subcategory: 'bags',
    price: 899,
    taxRate: 0.05,
    stock: 35,
    images: [
      new URL('@/assets/products/art canvas tote bag.webp', import.meta.url).href,
      new URL('@/assets/products/art canvas tote bag1.webp', import.meta.url).href,
      new URL('@/assets/products/art canvas tote bag2.webp', import.meta.url).href,
      new URL('@/assets/products/art canvas tote bag3.webp', import.meta.url).href
    ],
    description: 'Sustainable art canvas tote bag with unique hand-painted designs. Eco-friendly and spacious for daily use.',
    shortDescription: 'Hand-painted canvas tote',
    attributes: {
      material: 'Canvas',
      size: 'Large',
      occasion: 'Casual, Daily Use',
      care: 'Machine wash cold'
    },
    badges: ['eco-friendly', 'handcrafted'],
    relatedIds: [],
    reviews: { rating: 4.7, count: 62 },
    seo: {
      title: 'Art Canvas Tote Bag - Eco-Friendly Hand-Painted',
      description: 'Sustainable hand-painted canvas tote bag. Perfect for daily use and eco-conscious lifestyle.',
      keywords: ['canvas tote', 'eco-friendly bag', 'hand-painted bag', 'sustainable fashion']
    },
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z'
  },
  
  {
    id: 'bag-003',
    title: 'Blue Brocade Designer Handbag',
    handle: 'blue-brocade-designer-handbag',
    sku: 'BAG-003',
    category: 'accessories',
    subcategory: 'bags',
    price: 1599,
    compareAtPrice: 1999,
    taxRate: 0.05,
    stock: 18,
    images: [
      new URL('@/assets/products/blue brocade designer handbag.webp', import.meta.url).href,
      new URL('@/assets/products/blue brocade designer handbag1.webp', import.meta.url).href,
      new URL('@/assets/products/blue brocade designer handbag2.webp', import.meta.url).href,
      new URL('@/assets/products/blue brocade designer handbag3.webp', import.meta.url).href
    ],
    description: 'Luxurious blue brocade designer handbag with intricate patterns. Perfect for parties and special occasions.',
    shortDescription: 'Designer brocade handbag',
    attributes: {
      material: 'Brocade',
      closure: 'Zipper',
      occasion: 'Party, Wedding',
      care: 'Dry clean recommended'
    },
    badges: ['handcrafted', 'new-arrival'],
    relatedIds: [],
    reviews: { rating: 4.8, count: 72 },
    seo: {
      title: 'Blue Brocade Designer Handbag - Ethnic Luxury Bag',
      description: 'Shop blue brocade designer handbag with intricate patterns. Perfect for weddings and parties.',
      keywords: ['brocade bag', 'designer handbag', 'ethnic bag', 'party bag']
    },
    createdAt: '2025-01-12T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z'
  },
  {
    id: 'bag-004',
    title: 'Yellow Floral Tote Bag',
    handle: 'yellow-floral-tote-bag',
    sku: 'BAG-004',
    category: 'accessories',
    subcategory: 'bags',
    price: 799,
    taxRate: 0.05,
    stock: 40,
    images: [
      new URL('@/assets/products/yellow floral tote bag.webp', import.meta.url).href,
      new URL('@/assets/products/yellow floral tote bag1.webp', import.meta.url).href,
      new URL('@/assets/products/yellow floral tote bag2.webp', import.meta.url).href,
      new URL('@/assets/products/yellow floral tote bag3.webp', import.meta.url).href
    ],
    description: 'Vibrant yellow tote bag with beautiful floral prints. Spacious and perfect for everyday use.',
    shortDescription: 'Floral print tote bag',
    attributes: {
      material: 'Cotton Canvas',
      size: 'Large',
      occasion: 'Casual, Daily Use',
      care: 'Machine wash cold'
    },
    badges: ['eco-friendly', 'bestseller'],
    relatedIds: [],
    reviews: { rating: 4.6, count: 95 },
    seo: {
      title: 'Yellow Floral Tote Bag - Cotton Canvas',
      description: 'Spacious yellow tote bag with floral prints. Perfect for daily use and shopping.',
      keywords: ['floral tote', 'cotton bag', 'everyday bag', 'yellow tote']
    },
    createdAt: '2025-01-08T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z'
  },
  {
    id: 'bag-005',
    title: 'Pink Brocade Sling Bag',
    handle: 'pink-brocade-sling-bag',
    sku: 'BAG-005',
    category: 'accessories',
    subcategory: 'bags',
    price: 1199,
    compareAtPrice: 1499,
    taxRate: 0.05,
    stock: 25,
    images: [
      new URL('@/assets/products/pink brocade sling bag.webp', import.meta.url).href,
      new URL('@/assets/products/pink brocade sling bag1.webp', import.meta.url).href,
      new URL('@/assets/products/pink brocade sling bag2.webp', import.meta.url).href
    ],
    description: 'Elegant pink brocade sling bag with adjustable strap. Compact yet spacious design.',
    shortDescription: 'Brocade sling bag',
    attributes: {
      material: 'Brocade',
      strap: 'Adjustable',
      occasion: 'Party, Casual',
      care: 'Spot clean only'
    },
    badges: ['handcrafted'],
    relatedIds: [],
    reviews: { rating: 4.7, count: 68 },
    seo: {
      title: 'Pink Brocade Sling Bag - Compact Party Bag',
      description: 'Elegant pink brocade sling bag with adjustable strap. Perfect for parties and outings.',
      keywords: ['brocade sling', 'pink bag', 'party sling', 'ethnic bag']
    },
    createdAt: '2025-01-14T00:00:00Z',
    updatedAt: '2025-01-14T00:00:00Z'
  },
  {
    id: 'bag-006',
    title: 'Multicolor Purse Set',
    handle: 'multicolor-purse-set',
    sku: 'BAG-006',
    category: 'accessories',
    subcategory: 'bags',
    price: 999,
    taxRate: 0.05,
    stock: 30,
    images: [
      new URL('@/assets/products/multicolor purse set.webp', import.meta.url).href,
      new URL('@/assets/products/multicolor purse set1.webp', import.meta.url).href,
      new URL('@/assets/products/multicolor purse set2.webp', import.meta.url).href,
      new URL('@/assets/products/multicolor purse set3.webp', import.meta.url).href
    ],
    description: 'Beautiful set of multicolor handcrafted purses. Perfect for gifting and personal use.',
    shortDescription: 'Handcrafted purse set',
    attributes: {
      material: 'Mixed Fabric',
      pieces: '3 Purses',
      occasion: 'Daily Use, Gifting',
      care: 'Spot clean only'
    },
    badges: ['handcrafted', 'bestseller'],
    relatedIds: [],
    reviews: { rating: 4.8, count: 112 },
    seo: {
      title: 'Multicolor Purse Set - Handcrafted Gift Set',
      description: 'Set of 3 handcrafted multicolor purses. Perfect for gifting and daily use.',
      keywords: ['purse set', 'gift set', 'handcrafted purse', 'ethnic purse']
    },
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z'
  },
  {
    id: 'bag-007',
    title: 'Hand Painted Potli Bag',
    handle: 'hand-painted-potli-bag',
    sku: 'BAG-007',
    category: 'accessories',
    subcategory: 'bags',
    price: 1099,
    taxRate: 0.05,
    stock: 22,
    images: [
      new URL('@/assets/products/hand painted potli bag.webp', import.meta.url).href,
      new URL('@/assets/products/hand painted potli bag1.webp', import.meta.url).href,
      new URL('@/assets/products/hand painted potli bag2.webp', import.meta.url).href,
      new URL('@/assets/products/hand painted potli bag3.webp', import.meta.url).href
    ],
    description: 'Unique hand-painted potli bag with artistic designs. Each piece is one-of-a-kind.',
    shortDescription: 'Hand-painted potli',
    attributes: {
      material: 'Canvas',
      art: 'Hand Painted',
      occasion: 'Wedding, Party',
      care: 'Dry clean only'
    },
    badges: ['handcrafted', 'limited-stock'],
    relatedIds: [],
    reviews: { rating: 4.9, count: 54 },
    seo: {
      title: 'Hand Painted Potli Bag - Unique Artistic Design',
      description: 'One-of-a-kind hand-painted potli bag. Perfect for weddings and special occasions.',
      keywords: ['hand painted bag', 'artistic potli', 'unique bag', 'wedding potli']
    },
    createdAt: '2025-01-16T00:00:00Z',
    updatedAt: '2025-01-16T00:00:00Z'
  },
  {
    id: 'home-001',
    title: 'Floral Pillow Cover',
    handle: 'floral-pillow-cover',
    sku: 'HOME-001',
    category: 'accessories',
    subcategory: 'home',
    price: 499,
    taxRate: 0.05,
    stock: 50,
    images: [
      new URL('@/assets/products/floral pillow cover.webp', import.meta.url).href,
      new URL('@/assets/products/floral pillow cover1.webp', import.meta.url).href,
      new URL('@/assets/products/floral pillow cover2.webp', import.meta.url).href
    ],
    description: 'Beautiful floral embroidered pillow cover. Adds elegance to your home decor.',
    shortDescription: 'Embroidered pillow cover',
    attributes: {
      material: 'Cotton',
      size: '16x16 inches',
      design: 'Floral Embroidery',
      care: 'Machine wash cold'
    },
    badges: ['handcrafted', 'eco-friendly'],
    relatedIds: [],
    reviews: { rating: 4.6, count: 78 },
    seo: {
      title: 'Floral Pillow Cover - Handcrafted Home Decor',
      description: 'Beautiful floral embroidered pillow cover. Perfect for elegant home decor.',
      keywords: ['pillow cover', 'home decor', 'floral embroidery', 'cushion cover']
    },
    createdAt: '2025-01-11T00:00:00Z',
    updatedAt: '2025-01-11T00:00:00Z'
  },
  {
    id: 'home-002',
    title: 'Blue Frill Embroidered Round Mat',
    handle: 'blue-frill-embroidered-mat',
    sku: 'HOME-002',
    category: 'accessories',
    subcategory: 'home',
    price: 699,
    taxRate: 0.05,
    stock: 35,
    images: [
      new URL('@/assets/products/blue frill embroidered round mat.webp', import.meta.url).href,
      new URL('@/assets/products/blue frill embroidered round mat1.webp', import.meta.url).href,
      new URL('@/assets/products/blue frill embroidered round mat2.webp', import.meta.url).href,
      new URL('@/assets/products/blue frill embroidered round mat3.webp', import.meta.url).href
    ],
    description: 'Elegant blue embroidered round mat with frills. Perfect for dining table decoration.',
    shortDescription: 'Embroidered round mat',
    attributes: {
      material: 'Cotton Blend',
      diameter: '12 inches',
      design: 'Frill Border',
      care: 'Hand wash recommended'
    },
    badges: ['handcrafted', 'new-arrival'],
    relatedIds: [],
    reviews: { rating: 4.7, count: 43 },
    seo: {
      title: 'Blue Frill Embroidered Round Mat - Table Decor',
      description: 'Elegant blue embroidered round mat with frills. Perfect for dining table decoration.',
      keywords: ['table mat', 'embroidered mat', 'home decor', 'round mat']
    },
    createdAt: '2025-01-13T00:00:00Z',
    updatedAt: '2025-01-13T00:00:00Z'
  },
  {
    id: 'service-001',
    title: 'Saree Stitching Service',
    handle: 'saree-stitching-service',
    sku: 'SRV-001',
    category: 'accessories',
    subcategory: 'alterations',
    price: 599,
    taxRate: 0.18,
    stock: 999,
    images: [
      new URL('@/assets/products/Saree Stiching.webp', import.meta.url).href,
      new URL('@/assets/products/Saree Stiching1.webp', import.meta.url).href
    ],
    description: 'Professional saree stitching and alteration service. Expert craftsmen ensure perfect fit.',
    shortDescription: 'Professional saree stitching',
    attributes: {
      service: 'Stitching',
      turnaround: '3-5 days',
      includes: 'Fall, Pico, Blouse',
      customization: 'Available'
    },
    badges: ['handcrafted', 'bestseller'],
    relatedIds: [],
    reviews: { rating: 4.9, count: 234 },
    seo: {
      title: 'Saree Stitching Service - Professional Alterations',
      description: 'Expert saree stitching service with fall, pico, and blouse. Perfect fit guaranteed.',
      keywords: ['saree stitching', 'saree alteration', 'fall pico', 'blouse stitching']
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  
  // Kurtis
  {
    id: 'kurti-001',
    title: 'Bamboo Silk A-Line Kurti',
    handle: 'bamboo-silk-a-line-kurti',
    sku: 'KUR-001',
    category: 'apparel',
    subcategory: 'kurtis',
    price: 2499,
    compareAtPrice: 2999,
    taxRate: 0.05,
    stock: 30,
    images: [
      '/api/placeholder/400/600',
      '/api/placeholder/400/600'
    ],
    description: 'Comfortable and sustainable bamboo silk kurti with elegant A-line silhouette. Perfect for both casual and formal occasions.',
    shortDescription: 'Sustainable bamboo silk A-line kurti',
    attributes: {
      fabric: 'Bamboo Silk',
      fit: 'A-Line',
      sleeve: 'Three Quarter',
      length: 'Knee Length',
      care: 'Hand wash recommended',
      sizes: 'XS, S, M, L, XL, XXL'
    },
    badges: ['eco-friendly', 'new-arrival'],
    relatedIds: ['bottom-001'],
    reviews: { rating: 4.7, count: 156 },
    seo: {
      title: 'Bamboo Silk A-Line Kurti - Eco-Friendly Fashion - Maninfini Trends',
      description: 'Sustainable bamboo silk kurti with A-line silhouette. Comfortable and stylish eco-friendly fashion.',
      keywords: ['bamboo kurti', 'eco kurti', 'sustainable fashion', 'bamboo silk']
    },
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z'
  },
  
  // Jewellery
  {
    id: 'jewellery-001',
    title: 'Heritage Kundan Choker Set',
    handle: 'heritage-kundan-choker-set',
    sku: 'JWL-001',
    category: 'jewellery',
    subcategory: 'necklaces',
    price: 8999,
    compareAtPrice: 10999,
    taxRate: 0.03,
    stock: 12,
    images: [
      '/api/placeholder/500/500',
      '/api/placeholder/500/500',
      '/api/placeholder/500/500'
    ],
    model3d: {
      glb: '/models/kundan-choker.glb',
      usdz: '/models/kundan-choker.usdz'
    },
    description: 'Exquisite heritage kundan choker set with matching earrings. Features traditional polki diamonds and intricate meenakari work.',
    shortDescription: 'Traditional kundan choker with earrings',
    attributes: {
      material: 'Brass',
      plating: '22K Gold',
      stones: 'Kundan, Polki',
      weight: '120g',
      hypoallergenic: true,
      occasion: 'Wedding, Festival'
    },
    badges: ['handcrafted', 'limited-stock'],
    relatedIds: ['saree-001'],
    reviews: { rating: 4.9, count: 78 },
    seo: {
      title: 'Heritage Kundan Choker Set - Traditional Indian Jewellery - Maninfini Trends',
      description: 'Authentic kundan choker set with polki diamonds and meenakari work. Perfect for weddings and festivals.',
      keywords: ['kundan jewellery', 'choker set', 'wedding jewellery', 'traditional jewellery']
    },
    createdAt: '2025-01-12T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z'
  },
  
  // Eco Collection
  {
    id: 'eco-001',
    title: 'Coffee Husk Handbag',
    handle: 'coffee-husk-handbag',
    sku: 'ECO-001',
    category: 'eco',
    subcategory: 'bags',
    price: 1899,
    taxRate: 0.05,
    stock: 20,
    images: [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ],
    description: 'Innovative handbag made from upcycled coffee husks. Waterproof, durable, and completely biodegradable.',
    shortDescription: 'Upcycled coffee husk handbag',
    attributes: {
      material: 'Coffee Husk Fiber',
      dimensions: '30cm x 25cm x 10cm',
      closure: 'Magnetic Snap',
      lining: 'Organic Cotton',
      waterproof: true,
      biodegradable: true
    },
    badges: ['eco-friendly', 'new-arrival'],
    relatedIds: [],
    reviews: { rating: 4.5, count: 43 },
    seo: {
      title: 'Coffee Husk Handbag - Sustainable Accessories - Maninfini Trends',
      description: 'Eco-friendly handbag made from upcycled coffee husks. Waterproof and biodegradable sustainable fashion.',
      keywords: ['coffee husk bag', 'eco bag', 'sustainable accessories', 'biodegradable bag']
    },
    createdAt: '2025-01-18T00:00:00Z',
    updatedAt: '2025-01-18T00:00:00Z'
  },
  
  // More products...
  {
    id: 'jewellery-002',
    title: 'Gold Plated Jhumka Earrings',
    handle: 'gold-plated-jhumka-earrings',
    sku: 'JWL-002',
    category: 'jewellery',
    subcategory: 'earrings',
    price: 1299,
    compareAtPrice: 1599,
    taxRate: 0.03,
    stock: 45,
    images: [
      '/api/placeholder/300/300',
      '/api/placeholder/300/300'
    ],
    description: 'Classic gold plated jhumka earrings with intricate filigree work and pearl drops.',
    shortDescription: 'Traditional jhumka earrings with pearls',
    attributes: {
      material: 'Brass',
      plating: '18K Gold',
      stones: 'Fresh Water Pearls',
      weight: '25g',
      hypoallergenic: true,
      occasion: 'Daily Wear, Casual'
    },
    badges: ['bestseller'],
    relatedIds: [],
    reviews: { rating: 4.6, count: 234 },
    seo: {
      title: 'Gold Plated Jhumka Earrings with Pearls - Maninfini Trends',
      description: 'Traditional jhumka earrings with gold plating and pearl drops. Perfect for daily wear.',
      keywords: ['jhumka earrings', 'gold earrings', 'pearl earrings', 'traditional earrings']
    },
    createdAt: '2025-01-08T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z'
  },
  ...generatedProducts
];

export const collections: Collection[] = [
  {
    id: 'wedding-collection',
    title: 'Wedding Collection',
    handle: 'wedding-collection',
    description: 'Exquisite bridal wear and accessories for your special day',
    image: '/api/placeholder/800/600',
    productIds: ['saree-001', 'jewellery-001'],
    seo: {
      title: 'Wedding Collection - Bridal Sarees & Jewellery - Maninfini Trends',
      description: 'Discover our exquisite wedding collection featuring bridal sarees, lehengas, and traditional jewellery.'
    }
  },
  {
    id: 'eco-collection',
    title: 'Eco Home & Living',
    handle: 'eco-collection',
    description: 'Sustainable homeware crafted from rice husk and bamboo fibers — planters, tableware, drinkware and more.',
    image: ecoCollectionImage,
    productIds: ecoProductIds.slice(0, 24),
    seo: {
      title: 'Eco Home & Living — Sustainable Bio-Composite Collection - Maninfini Trends',
      description: 'Explore eco-friendly planters, tableware, and homeware made from rice husk and bamboo fiber bio-composites.'
    }
  }
];

export const categories: Category[] = [
  {
    id: 'apparel',
    title: 'Apparel',
    handle: 'apparel',
    description: 'Traditional and contemporary ethnic wear',
    image: '/api/placeholder/400/300',
    attributes: ['size', 'fabric', 'color', 'occasion']
  },
  {
    id: 'sarees',
    title: 'Sarees',
    handle: 'sarees',
    description: 'Elegant sarees for every occasion',
    image: '/api/placeholder/400/300',
    parentId: 'apparel',
    attributes: ['fabric', 'weave', 'length', 'blouse', 'occasion', 'care']
  },
  {
    id: 'jewellery',
    title: 'Jewellery',
    handle: 'jewellery',
    description: 'Exclusive imitation jewellery collection',
    image: '/api/placeholder/400/300',
    attributes: ['material', 'plating', 'stones', 'occasion', 'weight']
  },
  // Eco Home & Living
  {
    id: 'eco',
    title: 'Eco Home & Living',
    handle: 'eco',
    description: 'Sustainable homeware made from bio-composites',
    image: '/api/placeholder/400/300',
    attributes: ['material', 'care', 'eco']
  },
  {
    id: 'planters',
    title: 'Planters',
    handle: 'planters',
    description: 'Eco-friendly planters and pots',
    image: '/api/placeholder/400/300',
    parentId: 'eco',
    attributes: ['material', 'size', 'finish', 'care']
  },
  {
    id: 'tableware',
    title: 'Tableware',
    handle: 'tableware',
    description: 'Plates, bowls and serving essentials',
    image: '/api/placeholder/400/300',
    parentId: 'eco',
    attributes: ['material', 'care', 'finish']
  },
  {
    id: 'drinkware',
    title: 'Drinkware',
    handle: 'drinkware',
    description: 'Cups, tumblers and bottles',
    image: '/api/placeholder/400/300',
    parentId: 'eco',
    attributes: ['material', 'care', 'capacity']
  },
  {
    id: 'cutlery',
    title: 'Cutlery',
    handle: 'cutlery',
    description: 'Eco-friendly spoons, forks and more',
    image: '/api/placeholder/400/300',
    parentId: 'eco',
    attributes: ['material', 'care']
  },
  {
    id: 'storage',
    title: 'Storage',
    handle: 'storage',
    description: 'Boxes, baskets and organizers',
    image: '/api/placeholder/400/300',
    parentId: 'eco',
    attributes: ['material', 'capacity', 'care']
  },
  {
    id: 'kitchenware',
    title: 'Kitchenware',
    handle: 'kitchenware',
    description: 'Boards, strainers and prep tools',
    image: '/api/placeholder/400/300',
    parentId: 'eco',
    attributes: ['material', 'care']
  }
];
