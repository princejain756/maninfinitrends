import { Router } from 'express';
import { prisma } from '../db/client';
import { z } from 'zod';

export const paymentsRouter = Router();

const confirmSchema = z.object({
  orderId: z.string().uuid(),
  provider: z.literal('razorpay'),
  providerPaymentId: z.string().min(3),
});

// Records a successful payment authorization from client (e.g., Razorpay handler)
paymentsRouter.post('/confirm', async (req, res, next) => {
  try {
    const body = confirmSchema.parse(req.body);
    const order = await prisma.order.findUnique({ where: { id: body.orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Upsert by providerPaymentId to avoid duplicates on retries
    const existing = await prisma.payment.findFirst({ where: { providerPaymentId: body.providerPaymentId } });
    if (existing) return res.json(existing);

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: body.provider,
        providerPaymentId: body.providerPaymentId,
        amountCents: order.totalCents,
        currency: order.currency,
        status: 'AUTHORIZED',
      },
    });

    res.status(201).json(payment);
  } catch (err) { next(err); }
});

