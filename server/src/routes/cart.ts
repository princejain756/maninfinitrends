import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';

export const cartRouter = Router();

const addItemSchema = z
  .object({
    variantId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
    slug: z.string().min(1).optional(),
    quantity: z.number().int().min(1).max(99),
    options: z.record(z.string(), z.string()).optional(),
  })
  .refine((d) => !!(d.variantId || d.productId || d.slug), {
    message: 'variantId, productId or slug is required',
    path: ['variantId'],
  });

const syncSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid().optional(),
      slug: z.string().min(1).optional(),
      quantity: z.number().int().min(1).max(99),
      options: z.record(z.string(), z.string()).optional(),
    })
  ).min(0),
  replace: z.boolean().default(true),
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

      let variant = null as any;
      if (body.variantId) {
        variant = await tx.productVariant.findUnique({ where: { id: body.variantId }, include: { inventory: true } });
      } else {
        const product = body.productId
          ? await tx.product.findUnique({ where: { id: body.productId }, include: { variants: { include: { inventory: true } } } })
          : await tx.product.findUnique({ where: { slug: body.slug! }, include: { variants: { include: { inventory: true } } } });
        variant = product?.variants?.[0] || null;
      }
      if (!variant) throw new Error('Variant not found');

      // Optional inventory check
      if (variant.inventory && variant.inventory.quantity < body.quantity) {
        throw new Error('Insufficient inventory');
      }

      const existing = await tx.cartItem.findUnique({
        where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } },
      });

      const options: any = body.options ? (body.options as any) : undefined;
      const item = existing
        ? await tx.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + body.quantity, unitPrice: variant.priceCents, currency: variant.currency, options },
          })
        : await tx.cartItem.create({
            data: {
              cartId: cart.id,
              variantId: variant.id,
              quantity: body.quantity,
              unitPrice: variant.priceCents,
              currency: variant.currency,
              options,
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

// Syncs the server cart with a list of product ids/slugs + quantities.
// Default behavior: replace existing cart items for the session.
cartRouter.post('/sync', async (req, res, next) => {
  try {
    const sid = req.sessionId!;
    const body = syncSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // Ensure active cart for session
      let cart = await tx.cart.findFirst({ where: { session: { token: sid }, status: 'ACTIVE' } });
      if (!cart) {
        const session = await tx.session.findUnique({ where: { token: sid } });
        cart = await tx.cart.create({ data: { sessionId: session!.id } });
      }

      if (body.replace) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      for (const it of body.items) {
        const product = it.productId
          ? await tx.product.findUnique({ where: { id: it.productId }, include: { variants: { include: { inventory: true } } } })
          : await tx.product.findUnique({ where: { slug: it.slug! }, include: { variants: { include: { inventory: true } } } });
        if (!product || !product.variants[0]) throw new Error('Product/variant not found');
        const v = product.variants[0];
        if (v.inventory && v.inventory.quantity < it.quantity) throw new Error('Insufficient inventory');

        const existing = await tx.cartItem.findUnique({ where: { cartId_variantId: { cartId: cart.id, variantId: v.id } } });
        if (existing) {
          await tx.cartItem.update({ where: { id: existing.id }, data: { quantity: it.quantity, unitPrice: v.priceCents, currency: v.currency, options: (it as any).options || undefined } });
        } else {
          await tx.cartItem.create({ data: { cartId: cart.id, variantId: v.id, quantity: it.quantity, unitPrice: v.priceCents, currency: v.currency, options: (it as any).options || undefined } });
        }
      }

      const updated = await tx.cart.findUnique({ where: { id: cart.id }, include: { items: true } });
      const totalCents = (updated?.items || []).reduce((s, x) => s + x.unitPrice * x.quantity, 0);
      const count = (updated?.items || []).reduce((s, x) => s + x.quantity, 0);
      return { id: cart.id, totalCents, count };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});
