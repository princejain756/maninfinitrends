import { api } from '@/lib/api';
import type { Product } from '@/types/product';

// Server-side types (subset)
export interface ServerProductVariant {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
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

export interface ServerProductMaterialLink {
  material: { slug: string; name: string };
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
  materials?: ServerProductMaterialLink[];
  care?: string[] | null;
  specs?: Record<string, any> | null;
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
  const compareAtRupees = primaryVariant?.compareAtPriceCents ? Math.round(primaryVariant.compareAtPriceCents / 100) : undefined;
  const stock = (p.variants || []).reduce((sum, v) => sum + (v.inventory?.quantity || 0), 0);
  const primaryCategory = p.categories?.[0]?.category?.slug || 'general';
  const materials = (p as any).materials && Array.isArray((p as any).materials)
    ? ((p as any).materials as ServerProductMaterialLink[]).map((m) => ({ slug: m.material?.slug || '', name: m.material?.name || '' })).filter(x=>x.slug)
    : [];

  // Prefer DB meta fields when present
  if (Array.isArray((p as any).care)) care = (p as any).care as string[];
  if ((p as any).seoTitle) seoTitle = String((p as any).seoTitle);
  if ((p as any).seoDescription) seoDescription = String((p as any).seoDescription);
  if ((p as any).seoKeywords && typeof (p as any).seoKeywords === 'string') {
    seoKeywords = String((p as any).seoKeywords).split(',').map(s=>s.trim()).filter(Boolean);
  }

  // Create a text-only short description (strip HTML/inline styles)
  const descHtml = description || '';
  const descNoTags = descHtml
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[^]*?-->/g, ' ') // comments
    .replace(/<[^>]+>/g, ' ') // tags
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
  const short = descNoTags || p.title;

  // Map category to one of the allowed values
  const normalizedCategory = (() => {
    const cat = primaryCategory.toLowerCase();
    if (cat.includes('jewel')) return 'jewellery' as const;
    if (cat.includes('eco')) return 'eco' as const;
    if (cat.includes('accessor')) return 'accessories' as const;
    return 'apparel' as const;
  })();

  const ui: Product = {
    id: p.id,
    title: p.title,
    handle: p.slug,
    sku: primaryVariant?.sku || '',
    category: normalizedCategory,
    subcategory: primaryCategory || 'general',
    price: priceRupees,
    compareAtPrice: compareAtRupees && compareAtRupees > priceRupees ? compareAtRupees : undefined,
    taxRate: 0.18,
    stock,
    images: (p.images || []).map((img) => img.url),
    description: description,
    shortDescription: short.slice(0, 160),
    attributes: (p as any).specs ? (p as any).specs as any : {},
    materials: Array.isArray(materials) ? materials : [],
    care,
    badges: [],
    relatedIds: [],
    reviews: { rating: 0, count: 0 },
    seo: { title: seoTitle || p.title, description: seoDescription || p.description || '', keywords: seoKeywords },
    createdAt: new Date(p.createdAt).toISOString(),
    updatedAt: new Date(p.updatedAt).toISOString(),
  } as Product;
  // Final guard to ensure shape consistency
  if (!Array.isArray(ui.materials)) (ui as any).materials = [];
  return ui;
}

export async function fetchAllProducts(): Promise<Product[]> {
  const items = await api<ServerProduct[]>('/api/products');
  return items.map(mapServerProductToUi);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const item = await api<ServerProduct>(`/api/products/${slug}`);
  return mapServerProductToUi(item);
}
