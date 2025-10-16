import { Router } from 'express';
import { prisma } from '../db/client';

export const categoriesRouter = Router();

// List categories with product counts (active products only)
categoriesRouter.get('/', async (_req, res, next) => {
  try {
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

    res.json(data);
  } catch (err) {
    next(err);
  }
});

