import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';

export const cartRouter = Router();

const addItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

cartRouter.get('/', async (req, res, next) => {
  try {
    const sid = req.sessionId!;
    const activeCart = await prisma.cart.findFirst({
      where: { session: { token: sid }, status: 'ACTIVE' },
      include: {
        items: { include: { variant: { include: { product: true } } } },
      },
    });

    if (!activeCart) {
      return res.json({
        id: null,
        items: [],
        totalCents: 0,
        currency: 'INR',
        count: 0,
      });
    }

    const totalCents = activeCart.items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const count = activeCart.items.reduce((s, it) => s + it.quantity, 0);
    res.json({
      id: activeCart.id,
      items: activeCart.items.map((it) => ({
        id: it.id,
        variantId: it.variantId,
        title: it.variant.product.title + (it.variant.name ? ` - ${it.variant.name}` : ''),
        currency: it.currency,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      })),
      totalCents,
      currency: activeCart.items[0]?.currency ?? 'INR',
      count,
    });
  } catch (err) {
    next(err);
  }
});

cartRouter.post('/items', async (req, res, next) => {
  try {
    const sid = req.sessionId!;
    const body = addItemSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // Ensure active cart for session
      let cart = await tx.cart.findFirst({ where: { session: { token: sid }, status: 'ACTIVE' } });
      if (!cart) {
        const session = await tx.session.findUnique({ where: { token: sid } });
        cart = await tx.cart.create({ data: { sessionId: session!.id } });
      }

      const variant = await tx.productVariant.findUnique({ where: { id: body.variantId }, include: { inventory: true } });
      if (!variant) throw new Error('Variant not found');

      // Optional inventory check
      if (variant.inventory && variant.inventory.quantity < body.quantity) {
        throw new Error('Insufficient inventory');
      }

      const existing = await tx.cartItem.findUnique({
        where: { cartId_variantId: { cartId: cart.id, variantId: body.variantId } },
      });

      const item = existing
        ? await tx.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + body.quantity, unitPrice: variant.priceCents, currency: variant.currency },
          })
        : await tx.cartItem.create({
            data: {
              cartId: cart.id,
              variantId: body.variantId,
              quantity: body.quantity,
              unitPrice: variant.priceCents,
              currency: variant.currency,
            },
          });

      return { cartId: cart.id, item };
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

cartRouter.patch('/items/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const quantity = Number(req.body?.quantity);
    if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.findUnique({ where: { id } });
      if (!item) throw new Error('Item not found');
      const variant = await tx.productVariant.findUnique({ where: { id: item.variantId }, include: { inventory: true } });
      if (!variant) throw new Error('Variant not found');
      if (variant.inventory && variant.inventory.quantity < quantity) {
        throw new Error('Insufficient inventory');
      }
      return tx.cartItem.update({ where: { id }, data: { quantity } });
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

cartRouter.delete('/items/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await prisma.cartItem.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

