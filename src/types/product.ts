export interface Product {
  id: string;
  title: string;
  handle: string;
  sku: string;
  category: 'apparel' | 'jewellery' | 'accessories' | 'eco';
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  taxRate: number;
  stock: number;
  images: string[];
  video?: string;
  model3d?: {
    glb: string;
    usdz: string;
  };
  description: string;
  shortDescription: string;
  attributes: Record<string, any>;
  care?: string[];
  badges: ('handcrafted' | 'eco-friendly' | 'limited-stock' | 'bestseller' | 'new-arrival')[];
  relatedIds: string[];
  reviews: {
    rating: number;
    count: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: Record<string, string>;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
  productIds: string[];
  seo: {
    title: string;
    description: string;
  };
}

export interface Category {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
  parentId?: string;
  attributes: string[];
}