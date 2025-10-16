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
        items: { include: { variant: { include: { product: true } } } },
        payments: true,
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) { next(err); }
});

