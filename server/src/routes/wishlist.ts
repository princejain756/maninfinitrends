import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';
import { requireAuth } from '../middleware/auth';

export const wishlistRouter = Router();

// Get wishlist items for current user
wishlistRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.id as string;
    const rows = await prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: {
            variants: { include: { inventory: true } },
            images: true,
            categories: { include: { category: true } },
          },
        },
      },
    });
    res.json(rows.map(r => r.product));
  } catch (err) { next(err); }
});

// Toggle wishlist item for current user
wishlistRouter.post('/toggle', requireAuth, async (req, res, next) => {
  try {
    const schema = z.object({ productId: z.string().uuid() });
    const { productId } = schema.parse(req.body);
    const userId = req.user!.id as string;
    const existing = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });
    let state: 'added' | 'removed' = 'added';
    if (existing) {
      await prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } });
      state = 'removed';
    } else {
      await prisma.wishlistItem.create({ data: { userId, productId } });
    }
    res.json({ ok: true, state });
  } catch (err) { next(err); }
});

// Merge client wishlist into server (union)
wishlistRouter.post('/sync', requireAuth, async (req, res, next) => {
  try {
    const schema = z.object({ productIds: z.array(z.string().uuid()).default([]) });
    const { productIds } = schema.parse(req.body || {});
    const userId = req.user!.id as string;

    const existing = await prisma.wishlistItem.findMany({ where: { userId } });
    const existingIds = new Set(existing.map(i => i.productId));
    const toAdd = productIds.filter(id => !existingIds.has(id));
    if (toAdd.length) {
      await prisma.wishlistItem.createMany({ data: toAdd.map(id => ({ userId, productId: id })) });
    }
    const all = new Set([...existingIds, ...productIds]);
    res.json({ productIds: Array.from(all) });
  } catch (err) { next(err); }
});

