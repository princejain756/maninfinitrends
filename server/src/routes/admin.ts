import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';
import { requireAdmin } from '../middleware/auth';
import { env } from '../env';

export const adminRouter = Router();

adminRouter.use(requireAdmin);

const productSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  sku: z.string().min(1),
  priceCents: z.number().int().positive(),
  currency: z.string().min(1).default('INR'),
  images: z.array(z.string().url()).default([]),
  categories: z.array(z.string().min(1)).default([]), // names or slugs
});

adminRouter.post('/products', async (req, res, next) => {
  try {
    const body = productSchema.parse(req.body);

    // Ensure unique slug
    const exists = await prisma.product.findUnique({ where: { slug: body.slug } });
    if (exists) return res.status(400).json({ error: 'Slug already exists' });

    // Upsert categories by slug (normalized) or name
    const catLinks = await Promise.all(
      body.categories.map(async (c) => {
        const slug = c.trim().toLowerCase().replace(/\s+/g, '-');
        const cat = await prisma.category.upsert({
          where: { slug },
          update: {},
          create: { slug, name: c },
        });
        return { categoryId: cat.id };
      })
    );

    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        variants: {
          create: [
            {
              sku: body.sku,
              name: 'Default',
              priceCents: body.priceCents,
              currency: body.currency,
              inventory: { create: { quantity: 0 } },
            },
          ],
        },
        images: { create: body.images.map((url, i) => ({ url, position: i })) },
        categories: { create: catLinks },
      },
      include: { variants: true, images: true, categories: { include: { category: true } } },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// List products (admin view)
adminRouter.get('/products', async (_req, res, next) => {
  try {
    const prods = await prisma.product.findMany({
      include: {
        variants: { include: { inventory: true } },
        images: true,
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(prods);
  } catch (err) {
    next(err);
  }
});

// Get single product by id
adminRouter.get('/products/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
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

// Update product (basic fields, replace images + categories, update first variant sku/price)
const updateProductSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
  slug: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  priceCents: z.number().int().positive().optional(),
  images: z.array(z.string().url()).optional(),
  categories: z.array(z.string().min(1)).optional(),
});

adminRouter.patch('/products/:id', async (req, res, next) => {
  try {
    const body = updateProductSchema.parse(req.body);
    const prod = await prisma.product.findUnique({ where: { id: req.params.id }, include: { variants: true } });
    if (!prod) return res.status(404).json({ error: 'Not found' });

    const ops: any = { data: { } };
    if (body.title !== undefined) ops.data.title = body.title;
    if (body.description !== undefined) ops.data.description = body.description;
    if (body.active !== undefined) ops.data.active = body.active;
    if (body.slug !== undefined) ops.data.slug = body.slug;

    if (body.images) {
      ops.data.images = { deleteMany: {}, create: body.images.map((url: string, i: number) => ({ url, position: i })) };
    }

    if (body.categories) {
      const links = await Promise.all(body.categories.map(async (c: string) => {
        const slug = c.trim().toLowerCase().replace(/\s+/g, '-');
        const cat = await prisma.category.upsert({ where: { slug }, update: {}, create: { slug, name: c } });
        return { categoryId: cat.id };
      }));
      ops.data.categories = { deleteMany: {}, create: links };
    }

    await prisma.product.update({ where: { id: req.params.id }, ...ops });

    // Update first variant sku/price if provided
    if ((body.sku || body.priceCents) && prod.variants[0]) {
      await prisma.productVariant.update({ where: { id: prod.variants[0].id }, data: { sku: body.sku ?? prod.variants[0].sku, priceCents: body.priceCents ?? prod.variants[0].priceCents } });
    }

    const finalProd = await prisma.product.findUnique({ where: { id: req.params.id }, include: { variants: { include: { inventory: true } }, images: true, categories: { include: { category: true } } } });
    res.json(finalProd);
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/products/:id', async (req, res, next) => {
  try {
    await prisma.productImage.deleteMany({ where: { productId: req.params.id } });
    await prisma.productCategory.deleteMany({ where: { productId: req.params.id } });
    const variants = await prisma.productVariant.findMany({ where: { productId: req.params.id } });
    for (const v of variants) {
      await prisma.inventory.deleteMany({ where: { variantId: v.id } });
    }
    await prisma.productVariant.deleteMany({ where: { productId: req.params.id } });
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Orders list/detail/update status
adminRouter.get('/orders', async (_req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { variant: { include: { product: true } } } }, payments: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(orders);
  } catch (err) { next(err); }
});

adminRouter.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { variant: { include: { product: true } } } }, payments: true, user: true, shippingAddress: true, billingAddress: true },
    });
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (err) { next(err); }
});

adminRouter.patch('/orders/:id', async (req, res, next) => {
  try {
    const schema = z.object({ status: z.enum(['PENDING','PAID','FULFILLED','CANCELLED','REFUNDED']) });
    const { status } = schema.parse(req.body);
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
    res.json(order);
  } catch (err) { next(err); }
});

// Capture payment (Razorpay) for an order
adminRouter.post('/orders/:id/capture', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { payments: true } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const payment = order.payments.find((p) => p.provider === 'razorpay');
    if (!payment || !payment.providerPaymentId) return res.status(400).json({ error: 'No Razorpay payment found' });
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) return res.status(400).json({ error: 'Razorpay not configured' });

    const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
    const amount = order.totalCents; // in paise
    const resp = await fetch(`https://api.razorpay.com/v1/payments/${payment.providerPaymentId}/capture`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ amount: String(amount), currency: order.currency || 'INR' }),
    });
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(400).json({ error: 'Capture failed', detail: text });
    }
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'CAPTURED' } });
    await prisma.order.update({ where: { id: order.id }, data: { status: 'PAID' } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Refund payment (Razorpay) for an order
adminRouter.post('/orders/:id/refund', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { payments: true } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const payment = order.payments.find((p) => p.provider === 'razorpay');
    if (!payment || !payment.providerPaymentId) return res.status(400).json({ error: 'No Razorpay payment found' });
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) return res.status(400).json({ error: 'Razorpay not configured' });

    const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
    const resp = await fetch(`https://api.razorpay.com/v1/payments/${payment.providerPaymentId}/refund`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ amount: String(order.totalCents) }),
    });
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(400).json({ error: 'Refund failed', detail: text });
    }
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'REFUNDED' } });
    await prisma.order.update({ where: { id: order.id }, data: { status: 'REFUNDED' } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Summary metrics
adminRouter.get('/summary', async (_req, res, next) => {
  try {
    const [productCount, orderCount, ticketCount, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.supportTicket.count(),
      prisma.inventory.count({ where: { quantity: { lte: 5 } } }),
    ]);
    res.json({ productCount, orderCount, ticketCount, lowStock });
  } catch (err) { next(err); }
});

// Tickets
adminRouter.get('/tickets', async (_req, res, next) => {
  try {
    const tickets = await prisma.supportTicket.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
    res.json(tickets);
  } catch (err) { next(err); }
});

adminRouter.patch('/tickets/:id', async (req, res, next) => {
  try {
    const schema = z.object({ status: z.enum(['OPEN','IN_PROGRESS','RESOLVED','CLOSED']) });
    const { status } = schema.parse(req.body);
    const ticket = await prisma.supportTicket.update({ where: { id: req.params.id }, data: { status } });
    res.json(ticket);
  } catch (err) { next(err); }
});
