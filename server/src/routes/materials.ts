import { Router } from 'express';
import { prisma } from '../db/client';

export const materialsRouter = Router();

// List materials with product counts (active products only)
materialsRouter.get('/', async (_req, res, next) => {
  try {
    const [mats, counts] = await Promise.all([
      prisma.material.findMany({ orderBy: { name: 'asc' } }),
      prisma.productMaterial.groupBy({
        by: ['materialId'],
        _count: true,
        where: { product: { active: true } },
      }),
    ]);

    const countMap = new Map(counts.map((c) => [c.materialId, c._count]));
    const data = mats.map((m) => ({
      id: m.id,
      slug: m.slug,
      name: m.name,
      productCount: countMap.get(m.id) || 0,
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
});

