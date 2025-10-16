import { Router } from 'express';
import { prisma } from '../db/client';

export const checkoutRouter = Router();

checkoutRouter.post('/', async (req, res, next) => {
  try {
    const sid = req.sessionId!;
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findFirst({
        where: { session: { token: sid }, status: 'ACTIVE' },
        include: { items: true },
      });
      if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

      // Validate inventory
      for (const it of cart.items) {
        const inv = await tx.inventory.findUnique({ where: { variantId: it.variantId } });
        if (!inv || inv.quantity < it.quantity) {
          throw new Error('Insufficient inventory');
        }
      }

      // Create order
      const o = await tx.order.create({
        data: {
          status: 'PENDING',
          currency: cart.items[0]?.currency ?? 'INR',
          totalCents: cart.items.reduce((s, it) => s + it.unitPrice * it.quantity, 0),
          userId: (req.user?.id as string | undefined) || undefined,
          items: {
            create: cart.items.map((it) => ({
              variantId: it.variantId,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              currency: it.currency,
            })),
          },
        },
        include: { items: true },
      });

      // Deduct inventory
      for (const it of cart.items) {
        await tx.inventory.update({
          where: { variantId: it.variantId },
          data: { quantity: { decrement: it.quantity } },
        });
      }

      // Mark cart
      await tx.cart.update({ where: { id: cart.id }, data: { status: 'ORDERED' } });

      return o;
    });

    res.status(201).json({ orderId: order.id, totalCents: order.totalCents });
  } catch (err) {
    next(err);
  }
});
