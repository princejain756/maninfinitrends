import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';

export const categoriesRouter = Router();

// In-memory cache for categories list
let categoriesCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 120000; // 2 minute cache (categories change less often)

// List categories with product counts (active products only)
categoriesRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now = Date.now();
    if (categoriesCache && (now - categoriesCache.timestamp) < CACHE_TTL) {
      res.set('Cache-Control', 'public, max-age=120, s-maxage=600');
      return res.json(categoriesCache.data);
    }

    const [cats, counts] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
      prisma.productCategory.groupBy({
        by: ['categoryId'],
        _count: true,
        where: { product: { active: true } },
      }),
    ]);

    const countMap = new Map(counts.map((c) => [c.categoryId, c._count]));
    const data = cats.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      productCount: countMap.get(c.id) || 0,
    }));

    categoriesCache = { data, timestamp: now };
    res.set('Cache-Control', 'public, max-age=120, s-maxage=600');
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Cache invalidation
export const invalidateCategoriesCache = () => { categoriesCache = null; };
