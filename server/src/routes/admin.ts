import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { prisma } from '../db/client';
import { requireAdmin } from '../middleware/auth';
import { env } from '../env';

export const adminRouter = Router();

adminRouter.use(requireAdmin);

// Configure multer storage for image uploads
// Save files in the same uploads dir that index.ts serves
const uploadsPath = path.resolve(process.cwd(), 'dist/uploads');
try { fs.mkdirSync(uploadsPath, { recursive: true }); } catch { }
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsPath),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.jpg';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new Error('Only image files are allowed'));
  },
});

// Helper to Title Case a category name
const toTitleCase = (s: string) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
// Helper to make slugs URL-friendly
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

// Upload images (admin only). Returns absolute URLs for the uploaded files.
adminRouter.post('/uploads', upload.array('files', 10), async (req, res, next) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    // Prefer public origin (ensures HTTPS), fall back to request host.
    // Use the first origin if a comma-separated list is provided.
    const firstOrigin = env.ORIGIN?.split(',')[0].trim() || `${req.headers['x-forwarded-proto'] || req.protocol}://${req.get('host')}`;
    const urls = files.map((f) => `${firstOrigin}/uploads/${f.filename}`);
    res.json({ urls });
  } catch (err) {
    next(err);
  }
});

// Upload images endpoint (alias compatible with stashed changes)
adminRouter.post('/upload-images', upload.array('images', 10), async (req, res, next) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) return res.status(400).json({ error: 'No images uploaded' });
    const firstOrigin = env.ORIGIN?.split(',')[0].trim() || `${req.headers['x-forwarded-proto'] || req.protocol}://${req.get('host')}`;
    const urls = files.map((f) => `${firstOrigin}/uploads/${f.filename}`);
    res.json({ success: true, urls });
  } catch (err) {
    next(err);
  }
});

const productSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  sku: z.string().min(1),
  priceCents: z.number().int().positive(),
  compareAtPriceCents: z.number().int().positive().optional(),
  currency: z.string().min(1).default('INR'),
  images: z.array(z.string().min(1)).default([]),
  categories: z.array(z.string().min(1)).default([]), // names or slugs
  materials: z.array(z.string().min(1)).default([]), // names or slugs
  care: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  specs: z.record(z.string(), z.string()).optional(),
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
          create: { slug, name: toTitleCase(c) },
        });
        return { categoryId: cat.id };
      })
    );

    // Upsert materials by slug or name
    const matLinks = await Promise.all(
      body.materials.map(async (m) => {
        const slug = m.trim().toLowerCase().replace(/\s+/g, '-');
        const mat = await prisma.material.upsert({ where: { slug }, update: {}, create: { slug, name: toTitleCase(m) } });
        return { materialId: mat.id };
      })
    );

    const meta = extractMetaFromDescription(body.description);
    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        care: body.care ?? meta.care,
        seoTitle: body.seoTitle ?? meta.seoTitle,
        seoDescription: body.seoDescription ?? meta.seoDescription,
        seoKeywords: body.seoKeywords ?? meta.seoKeywords,
        specs: body.specs ?? meta.specs,
        variants: {
          create: [
            {
              sku: body.sku,
              name: 'Default',
              priceCents: body.priceCents,
              compareAtPriceCents: body.compareAtPriceCents,
              currency: body.currency,
              inventory: { create: { quantity: body.stock ?? 0 } },
            },
          ],
        },
        images: { create: body.images.map((url, i) => ({ url, position: i })) },
        categories: { create: catLinks },
        materials: { create: matLinks },
      },
      include: { variants: true, images: true, categories: { include: { category: true } }, materials: { include: { material: true } } },
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
        materials: { include: { material: true } },
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
        materials: { include: { material: true } },
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
  compareAtPriceCents: z.number().int().positive().optional(),
  images: z.array(z.string().min(1)).optional(),
  categories: z.array(z.string().min(1)).optional(),
  materials: z.array(z.string().min(1)).optional(),
  care: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  specs: z.record(z.string(), z.string()).optional(),
});

adminRouter.patch('/products/:id', async (req, res, next) => {
  try {
    const body = updateProductSchema.parse(req.body);
    const prod = await prisma.product.findUnique({ where: { id: req.params.id }, include: { variants: { include: { inventory: true } } } });
    if (!prod) return res.status(404).json({ error: 'Not found' });

    const ops: any = { data: {} };
    if (body.title !== undefined) ops.data.title = body.title;
    if (body.description !== undefined) {
      ops.data.description = body.description;
      const meta = extractMetaFromDescription(body.description);
      if (meta.care !== undefined) ops.data.care = meta.care;
      if (meta.seoTitle !== undefined) ops.data.seoTitle = meta.seoTitle;
      if (meta.seoDescription !== undefined) ops.data.seoDescription = meta.seoDescription;
      if (meta.seoKeywords !== undefined) ops.data.seoKeywords = meta.seoKeywords;
      if (meta.specs !== undefined) ops.data.specs = meta.specs as any;
    }
    if (body.active !== undefined) ops.data.active = body.active;
    if (body.slug !== undefined) ops.data.slug = body.slug;
    if (body.care !== undefined) ops.data.care = body.care;
    if (body.seoTitle !== undefined) ops.data.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) ops.data.seoDescription = body.seoDescription;
    if (body.seoKeywords !== undefined) ops.data.seoKeywords = body.seoKeywords;
    if (body.specs !== undefined) ops.data.specs = body.specs as any;

    if (body.images) {
      ops.data.images = { deleteMany: {}, create: body.images.map((url: string, i: number) => ({ url, position: i })) };
    }

    if (body.categories) {
      const links = await Promise.all(body.categories.map(async (c: string) => {
        const slug = c.trim().toLowerCase().replace(/\s+/g, '-');
        const cat = await prisma.category.upsert({ where: { slug }, update: {}, create: { slug, name: toTitleCase(c) } });
        return { categoryId: cat.id };
      }));
      ops.data.categories = { deleteMany: {}, create: links };
    }

    if (body.materials) {
      const links = await Promise.all(body.materials.map(async (m: string) => {
        const slug = m.trim().toLowerCase().replace(/\s+/g, '-');
        const mat = await prisma.material.upsert({ where: { slug }, update: {}, create: { slug, name: toTitleCase(m) } });
        return { materialId: mat.id };
      }));
      ops.data.materials = { deleteMany: {}, create: links };
    }

    await prisma.product.update({ where: { id: req.params.id }, ...ops });

    // Update first variant sku/price/stock if provided
    if (prod.variants[0]) {
      if (body.sku || body.priceCents || body.compareAtPriceCents) {
        await prisma.productVariant.update({ where: { id: prod.variants[0].id }, data: { sku: body.sku ?? prod.variants[0].sku, priceCents: body.priceCents ?? prod.variants[0].priceCents, compareAtPriceCents: body.compareAtPriceCents ?? prod.variants[0].compareAtPriceCents } });
      }
      if (body.stock !== undefined) {
        if (prod.variants[0].inventory) {
          await prisma.inventory.update({ where: { variantId: prod.variants[0].id }, data: { quantity: body.stock } });
        } else {
          await prisma.inventory.create({ data: { variantId: prod.variants[0].id, quantity: body.stock } });
        }
      }
    }

    const finalProd = await prisma.product.findUnique({ where: { id: req.params.id }, include: { variants: { include: { inventory: true } }, images: true, categories: { include: { category: true } }, materials: { include: { material: true } } } });
    res.json(finalProd);
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/products/:id', async (req, res, next) => {
  try {
    await prisma.productImage.deleteMany({ where: { productId: req.params.id } });
    await prisma.productCategory.deleteMany({ where: { productId: req.params.id } });
    await prisma.productMaterial.deleteMany({ where: { productId: req.params.id } });
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
      include: { items: { include: { variant: { include: { product: true } } } }, payments: true, user: true, shippingAddress: true },
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
    const schema = z.object({ status: z.enum(['PENDING', 'PAID', 'FULFILLED', 'CANCELLED', 'REFUNDED']) });
    const { status } = schema.parse(req.body);
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
    res.json(order);
  } catch (err) { next(err); }
});

// Delete an order (admin)
adminRouter.delete('/orders/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true, payments: true } });
    if (!order) return res.status(404).json({ error: 'Not found' });
    await prisma.$transaction(async (tx) => {
      await tx.payment.deleteMany({ where: { orderId: id } });
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.order.delete({ where: { id } });
    });
    res.json({ ok: true });
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

// Capture a COD payment (marks as paid without external gateway)
adminRouter.post('/orders/:id/capture-cod', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { payments: true } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const payment = order.payments.find((p) => p.provider === 'cod');
    if (!payment) return res.status(400).json({ error: 'No COD payment found' });
    if (payment.status === 'CAPTURED') return res.json({ ok: true, message: 'Already captured' });
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
    const schema = z.object({ status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']) });
    const { status } = schema.parse(req.body);
    const ticket = await prisma.supportTicket.update({ where: { id: req.params.id }, data: { status } });
    res.json(ticket);
  } catch (err) { next(err); }
});
// Extract PDP metadata from description HTML comment block
function extractMetaFromDescription(desc: unknown) {
  try {
    if (typeof desc !== 'string') return {} as any;
    const m = desc.match(/<!--META[\r\n]+([\s\S]*?)[\r\n]+META-->/i);
    if (!m) return {} as any;
    const meta = JSON.parse(m[1]);
    const care: string[] | undefined = Array.isArray(meta?.care) ? meta.care.map((s: any) => String(s)) : undefined;
    const seoTitle: string | undefined = meta?.seo?.title ? String(meta.seo.title) : undefined;
    const seoDescription: string | undefined = meta?.seo?.description ? String(meta.seo.description) : undefined;
    const seoKeywords: string | undefined = Array.isArray(meta?.seo?.keywords) ? meta.seo.keywords.map((s: any) => String(s)).join(', ') : undefined;
    const specs: Record<string, string> | undefined = meta?.specs && typeof meta.specs === 'object' ? Object.fromEntries(Object.entries(meta.specs).map(([k, v]: any) => [String(k), String(v)])) : undefined;
    return { care, seoTitle, seoDescription, seoKeywords, specs } as any;
  } catch { return {} as any; }
}
