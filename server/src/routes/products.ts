import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';

export const productsRouter = Router();

// In-memory cache for products list
let productsCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 60000; // 1 minute cache

// Optimized product query - only select needed fields
const getProductsOptimized = async () => {
  const now = Date.now();
  if (productsCache && (now - productsCache.timestamp) < CACHE_TTL) {
    return productsCache.data;
  }

  const products = await prisma.product.findMany({
    where: { active: true },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      createdAt: true,
      variants: {
        select: {
          id: true,
          sku: true,
          name: true,
          priceCents: true,
          compareAtPriceCents: true,
          currency: true,
          inventory: { select: { quantity: true } }
        }
      },
      images: { select: { url: true, alt: true, position: true }, orderBy: { position: 'asc' } },
      categories: { select: { category: { select: { id: true, slug: true, name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  productsCache = { data: products, timestamp: now };
  return products;
};

productsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getProductsOptimized();
    // Set cache headers for CDN
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    res.json(products);
  } catch (err) {
    next(err);
  }
});

productsRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        variants: { include: { inventory: true } },
        images: { orderBy: { position: 'asc' } },
        categories: { include: { category: true } },
        materials: { include: { material: true } },
      },
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.set('Cache-Control', 'public, max-age=60');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Reviews: list for product
productsRouter.get('/:slug/reviews', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
    if (!product) return res.status(404).json({ error: 'Not found' });
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
      take: 200,
    });
    res.json(reviews.map(r => ({ id: r.id, rating: r.rating, title: r.title, body: r.body, createdAt: r.createdAt, user: { id: r.userId, name: r.user?.name || r.user?.email?.split('@')[0] } })));
  } catch (err) { next(err); }
});

// Reviews: create/update for current user
productsRouter.post('/:slug/reviews', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({ rating: z.number().int().min(1).max(5), title: z.string().max(120).optional(), body: z.string().max(2000).optional() });
    const body = schema.parse(req.body);
    const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
    if (!product) return res.status(404).json({ error: 'Not found' });
    const userId = req.user!.id as string;
    const r = await prisma.review.upsert({
      where: { productId_userId: { productId: product.id, userId } },
      update: { rating: body.rating, title: body.title, body: body.body },
      create: { productId: product.id, userId, rating: body.rating, title: body.title, body: body.body },
    });
    // Invalidate cache on review submission
    productsCache = null;
    res.status(201).json(r);
  } catch (err) { next(err); }
});

// Cache invalidation endpoint for admin
export const invalidateProductsCache = () => { productsCache = null; };
