import { api } from '@/lib/api';
import type { Product } from '@/types/product';

// Server-side types (subset)
export interface ServerProductVariant {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  currency: string;
  inventory?: { quantity: number } | null;
}

export interface ServerProductImage {
  url: string;
  alt?: string | null;
  position?: number | null;
}

export interface ServerProductCategoryLink {
  category: { slug: string; name: string };
}

export interface ServerProduct {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  variants: ServerProductVariant[];
  images: ServerProductImage[];
  categories?: ServerProductCategoryLink[];
}

export function mapServerProductToUi(p: ServerProduct): Product {
  const primaryVariant = p.variants?.[0];
  const priceRupees = primaryVariant ? Math.round(primaryVariant.priceCents / 100) : 0;
  const stock = (p.variants || []).reduce((sum, v) => sum + (v.inventory?.quantity || 0), 0);
  const primaryCategory = p.categories?.[0]?.category?.slug || 'general';

  return {
    id: p.id,
    title: p.title,
    handle: p.slug,
    sku: primaryVariant?.sku || '',
    category: (primaryCategory as any) || 'general',
    subcategory: primaryCategory || 'general',
    price: priceRupees,
    compareAtPrice: undefined,
    taxRate: 0.18,
    stock,
    images: (p.images || []).map((img) => img.url),
    description: p.description || '',
    shortDescription: p.description ? String(p.description).slice(0, 140) : p.title,
    attributes: {},
    care: [],
    badges: [],
    relatedIds: [],
    reviews: { rating: 0, count: 0 },
    seo: { title: p.title, description: p.description || '', keywords: [] },
    createdAt: new Date(p.createdAt).toISOString(),
    updatedAt: new Date(p.updatedAt).toISOString(),
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  const items = await api<ServerProduct[]>('/api/products');
  return items.map(mapServerProductToUi);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const item = await api<ServerProduct>(`/api/products/${slug}`);
  return mapServerProductToUi(item);
}
