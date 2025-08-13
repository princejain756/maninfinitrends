import { Product, Collection, Category } from '@/types/product';

export const products: Product[] = [
  // Sarees
  {
    id: 'saree-001',
    title: 'Royal Banarasi Silk Saree',
    handle: 'royal-banarasi-silk-saree',
    sku: 'SAR-001',
    category: 'apparel',
    subcategory: 'sarees',
    price: 12999,
    compareAtPrice: 15999,
    taxRate: 0.05,
    stock: 15,
    images: [
      '/api/placeholder/600/800',
      '/api/placeholder/600/800',
      '/api/placeholder/600/800'
    ],
    description: 'Exquisite Royal Banarasi silk saree with intricate gold zari work. Handwoven by master craftsmen in Varanasi, this saree features traditional Mughal motifs and is perfect for weddings and special occasions.',
    shortDescription: 'Handwoven Banarasi silk with gold zari work',
    attributes: {
      fabric: 'Pure Silk',
      weave: 'Handloom',
      length: '5.5 meters',
      blouse: 'Included (80cm)',
      care: 'Dry clean only',
      origin: 'Varanasi, UP'
    },
    care: ['Dry clean only', 'Store in cotton cloth', 'Avoid direct sunlight'],
    badges: ['handcrafted', 'bestseller'],
    relatedIds: ['blouse-001', 'jewellery-001'],
    reviews: { rating: 4.8, count: 127 },
    seo: {
      title: 'Royal Banarasi Silk Saree with Gold Zari Work - Maninfini Trends',
      description: 'Shop authentic handwoven Banarasi silk sarees with intricate gold zari work. Perfect for weddings and special occasions.',
      keywords: ['banarasi saree', 'silk saree', 'wedding saree', 'zari work']
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'saree-002',
    title: 'Organic Cotton Handblock Saree',
    handle: 'organic-cotton-handblock-saree',
    sku: 'SAR-002',
    category: 'apparel',
    subcategory: 'sarees',
    price: 3999,
    taxRate: 0.05,
    stock: 25,
    images: [
      '/api/placeholder/600/800',
      '/api/placeholder/600/800'
    ],
    description: 'Sustainable organic cotton saree with traditional handblock prints. Made using natural dyes and eco-friendly processes.',
    shortDescription: 'Organic cotton with handblock prints',
    attributes: {
      fabric: 'Organic Cotton',
      weave: 'Handblock Print',
      length: '5.5 meters',
      blouse: 'Included (80cm)',
      care: 'Machine wash cold',
      origin: 'Rajasthan'
    },
    badges: ['eco-friendly', 'handcrafted'],
    relatedIds: [],
    reviews: { rating: 4.6, count: 89 },
    seo: {
      title: 'Organic Cotton Handblock Saree - Sustainable Fashion - Maninfini Trends',
      description: 'Eco-friendly organic cotton saree with traditional handblock prints. Sustainable fashion choice.',
      keywords: ['organic saree', 'eco-friendly saree', 'handblock print', 'sustainable fashion']
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
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
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
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
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
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
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
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
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  }
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
    title: 'Eco Collection',
    handle: 'eco-collection',
    description: 'Sustainable fashion made from eco-friendly materials',
    image: '/api/placeholder/800/600',
    productIds: ['saree-002', 'kurti-001', 'eco-001'],
    seo: {
      title: 'Eco Collection - Sustainable Fashion - Maninfini Trends',
      description: 'Shop our eco-friendly collection made from sustainable materials like bamboo, organic cotton, and recycled fibers.'
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
  }
];