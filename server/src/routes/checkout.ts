import { Router } from 'express';
import { prisma } from '../db/client';
import { z } from 'zod';

export const checkoutRouter = Router();

checkoutRouter.post('/', async (req, res, next) => {
  try {
    const sid = req.sessionId!;

    // Optional body with shipping address + chosen payment method
    const BodySchema = z.object({
      paymentMethod: z.enum(['cod', 'razorpay']).optional(),
      billingSame: z.boolean().optional(),
      savedAddressId: z.string().uuid().optional(),
      shippingAddress: z.object({
        name: z.string().min(1),
        line1: z.string().min(1),
        line2: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(1),
        postalCode: z.string().min(3),
        country: z.string().optional(),
        phone: z.string().optional(),
      }).optional(),
    }).optional();
    const body = BodySchema?.parse(req.body || {}) || {};

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

      // Prepare shipping/billing address
      let shippingAddressId: string | undefined;
      let billingAddressId: string | undefined;
      const userId = (req.user?.id as string | undefined) || undefined;

      if (body?.savedAddressId && userId) {
        const exists = await tx.address.findFirst({ where: { id: body.savedAddressId, userId } });
        if (exists) {
          shippingAddressId = exists.id;
          if (body?.billingSame) billingAddressId = exists.id;
        }
      }
      if (!shippingAddressId && body?.shippingAddress) {
        const addr = await tx.address.create({
          data: {
            userId,
            name: body.shippingAddress.name,
            line1: body.shippingAddress.line1,
            line2: body.shippingAddress.line2 || null,
            city: body.shippingAddress.city,
            state: body.shippingAddress.state,
            postalCode: body.shippingAddress.postalCode,
            country: body.shippingAddress.country || 'IN',
            phone: body.shippingAddress.phone || null,
          },
        });
        shippingAddressId = addr.id;
        if (body?.billingSame) billingAddressId = addr.id;
      }

      // Create order
      const o = await tx.order.create({
        data: {
          status: 'PENDING',
          currency: cart.items[0]?.currency ?? 'INR',
          totalCents: cart.items.reduce((s, it) => s + it.unitPrice * it.quantity, 0),
          userId,
          shippingAddressId,
          billingAddressId,
          items: {
            create: cart.items.map((it: any) => ({
              variantId: it.variantId,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              currency: it.currency,
              options: (it as any).options || undefined,
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

      // If COD, create a placeholder payment record for UI
      if (body?.paymentMethod === 'cod') {
        await tx.payment.create({
          data: {
            orderId: o.id,
            provider: 'cod',
            providerPaymentId: `cod-${o.id}`,
            amountCents: o.totalCents,
            currency: o.currency,
            status: 'PENDING',
          },
        });
      }

      return o;
    });

    res.status(201).json({ orderId: order.id, orderNumber: order.orderNumber, totalCents: order.totalCents });
  } catch (err) {
    next(err);
  }
});
