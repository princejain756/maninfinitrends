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
  care?: string[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
}

export function mapServerProductToUi(p: ServerProduct): Product {
  // Extract optional metadata block embedded in description as HTML comment
  let care: string[] = [];
  let seoTitle: string | undefined;
  let seoDescription: string | undefined;
  let seoKeywords: string[] = [];
  let description = p.description || '';
  const metaMatch = description.match(/<!--META[\r\n]+([\s\S]*?)[\r\n]+META-->/i);
  if (metaMatch) {
    try {
      const meta = JSON.parse(metaMatch[1]);
      if (Array.isArray(meta?.care)) care = meta.care.map((x: any) => String(x)).filter(Boolean);
      if (meta?.seo) {
        seoTitle = meta.seo.title || undefined;
        seoDescription = meta.seo.description || undefined;
        if (Array.isArray(meta.seo.keywords)) seoKeywords = meta.seo.keywords.map((x: any) => String(x));
      }
    } catch {}
    description = description.replace(metaMatch[0], '').trim();
  }
  const primaryVariant = p.variants?.[0];
  const priceRupees = primaryVariant ? Math.round(primaryVariant.priceCents / 100) : 0;
  const stock = (p.variants || []).reduce((sum, v) => sum + (v.inventory?.quantity || 0), 0);
  const primaryCategory = p.categories?.[0]?.category?.slug || 'general';

  // Prefer DB meta fields when present
  if (Array.isArray((p as any).care)) care = (p as any).care as string[];
  if ((p as any).seoTitle) seoTitle = String((p as any).seoTitle);
  if ((p as any).seoDescription) seoDescription = String((p as any).seoDescription);
  if ((p as any).seoKeywords) seoKeywords = String((p as any).seoKeywords).split(',').map(s=>s.trim()).filter(Boolean);

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
    description: description,
    shortDescription: p.description ? String(p.description).slice(0, 140) : p.title,
    attributes: {},
    care,
    badges: [],
    relatedIds: [],
    reviews: { rating: 0, count: 0 },
    seo: { title: seoTitle || p.title, description: seoDescription || p.description || '', keywords: seoKeywords },
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
