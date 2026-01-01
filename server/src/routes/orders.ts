import { Router } from 'express';
import { prisma } from '../db/client';
import { requireAuth } from '../middleware/auth';

export const ordersRouter = Router();

// List orders for the logged-in user
ordersRouter.get('/my', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { variant: { include: { product: { include: { images: true } } } } } },
        payments: true,
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) { next(err); }
});

// Get single order detail for the logged-in user
ordersRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId },
      include: {
        items: { include: { variant: { include: { product: { include: { images: true } } } } } },
        payments: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (err) { next(err); }
});
