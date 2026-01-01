import { Router } from 'express';
import { prisma } from '../db/client';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';

export const productsRouter = Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        variants: { include: { inventory: true } },
        images: true,
        categories: { include: { category: true } },
        materials: { include: { material: true } },
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
        materials: { include: { material: true } },
      },
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Reviews: list for product
productsRouter.get('/:slug/reviews', async (req, res, next) => {
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
productsRouter.post('/:slug/reviews', requireAuth, async (req, res, next) => {
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
    res.status(201).json(r);
  } catch (err) { next(err); }
});
