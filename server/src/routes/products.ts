import { Router } from 'express';
import { prisma } from '../db/client';

export const productsRouter = Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        variants: { include: { inventory: true } },
        images: true,
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

productsRouter.get('/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        variants: { include: { inventory: true } },
        images: true,
        categories: { include: { category: true } },
      },
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});
