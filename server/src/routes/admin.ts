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
try { fs.mkdirSync(uploadsPath, { recursive: true }); } catch {}
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

// Upload images (admin only). Returns absolute URLs for the uploaded files.
adminRouter.post('/uploads', upload.array('files', 10), async (req, res, next) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    // Prefer public origin (ensures HTTPS), fall back to request host
    const origin = env.ORIGIN || `${req.headers['x-forwarded-proto'] || req.protocol}://${req.get('host')}`;
    const urls = files.map((f) => `${origin}/uploads/${f.filename}`);
    res.json({ urls });
  } catch (err) {
    next(err);
  }
});

// List previously uploaded images for selection in admin UI
adminRouter.get('/uploads', async (req, res, next) => {
  try {
    const origin = env.ORIGIN || `${req.headers['x-forwarded-proto'] || req.protocol}://${req.get('host')}`;
    const files = await fs.promises.readdir(uploadsPath).catch(() => [] as string[]);
    const stats = await Promise.all(files.map(async (name) => {
      const p = path.join(uploadsPath, name);
      try {
        const st = await fs.promises.stat(p);
        if (!st.isFile()) return null;
        return { name, size: st.size, mtime: st.mtimeMs, url: `${origin}/uploads/${name}` };
      } catch { return null; }
    }));
    const list = stats.filter(Boolean).sort((a: any, b: any) => b.mtime - a.mtime);
    res.json({ files: list });
  } catch (err) { next(err); }
});

// Find usages of uploaded images by filename or URL
adminRouter.get('/uploads/usages', async (req, res, next) => {
  try {
    const namesParam = (req.query.names as string | undefined) || '';
    const urlsParam = (req.query.urls as string | undefined) || '';
    const names = namesParam.split(',').map((s) => s.trim()).filter(Boolean);
    const urls = urlsParam.split(',').map((s) => s.trim()).filter(Boolean);
    const keySet = new Set<string>();
    for (const n of names) keySet.add(n);
    for (const u of urls) {
      try { const nm = new URL(u).pathname.split('/').pop(); if (nm) keySet.add(nm); } catch {}
    }

    const usages: Record<string, any[]> = {};
    for (const name of keySet) {
      const rows = await prisma.productImage.findMany({
        where: { url: { endsWith: `/${name}` } },
        include: { product: { select: { id: true, slug: true, title: true } } },
      });
      usages[name] = rows.map((r) => ({ imageId: r.id, productId: r.productId, product: r.product }));
    }
    res.json({ usages });
  } catch (err) { next(err); }
});

// Detach uploaded images from products (delete ProductImage rows) and reindex positions
adminRouter.post('/uploads/detach', async (req, res, next) => {
  try {
    const body = (req.body || {}) as { urls?: string[]; names?: string[] };
    const names = new Set<string>();
    (body.urls || []).forEach((u) => { try { const n = new URL(u).pathname.split('/').pop(); if (n) names.add(n); } catch {} });
    (body.names || []).forEach((n) => { if (n) names.add(n); });
    const impacted = new Set<string>();
    let count = 0;
    for (const n of names) {
      const rows = await prisma.productImage.findMany({ where: { url: { endsWith: `/${n}` } }, select: { id: true, productId: true } });
      if (rows.length === 0) continue;
      for (const r of rows) impacted.add(r.productId);
      await prisma.productImage.deleteMany({ where: { id: { in: rows.map((r) => r.id) } } });
      count += rows.length;
      for (const r of rows) impacted.add(r.productId);
    }
    // Reindex positions for impacted products
    for (const pid of Array.from(impacted)) {
      const imgs = await prisma.productImage.findMany({ where: { productId: pid }, orderBy: { position: 'asc' }, select: { id: true } });
      for (let i = 0; i < imgs.length; i++) {
        await prisma.productImage.update({ where: { id: imgs[i].id }, data: { position: i } });
      }
    }
    res.json({ detached: count, productsUpdated: impacted.size });
  } catch (err) { next(err); }
});
// Delete uploaded images by url or filename (admin only)
adminRouter.post('/uploads/delete', async (req, res, next) => {
  try {
    const body = req.body as { urls?: string[]; names?: string[] } | undefined;
    const names = new Set<string>();
    (body?.urls || []).forEach((u) => { try { const n = new URL(u).pathname.split('/').pop(); if (n) names.add(n); } catch { /* ignore */ } });
    (body?.names || []).forEach((n) => { if (n) names.add(n); });
    let deleted = 0; const failed: string[] = [];
    for (const n of names) {
      const p = path.join(uploadsPath, n);
      try { await fs.promises.unlink(p); deleted++; } catch { failed.push(n); }
    }
    res.json({ deleted, failed });
  } catch (err) { next(err); }
});

// Variants management (basic): add/update/delete with inventory
const variantCreateSchema = z.object({ sku: z.string().min(1), name: z.string().min(1), priceCents: z.number().int().nonnegative(), stock: z.number().int().nonnegative().optional(), currency: z.string().default('INR') });
adminRouter.post('/products/:id/variants', async (req, res, next) => {
  try {
    const data = variantCreateSchema.parse(req.body);
    const variant = await prisma.productVariant.create({ data: { productId: req.params.id, sku: data.sku, name: data.name, priceCents: data.priceCents, currency: data.currency, inventory: { create: { quantity: data.stock ?? 0 } } } });
    res.status(201).json(variant);
  } catch (err) { next(err); }
});

const variantUpdateSchema = z.object({ sku: z.string().min(1).optional(), name: z.string().min(1).optional(), priceCents: z.number().int().nonnegative().optional(), stock: z.number().int().nonnegative().optional() });
adminRouter.patch('/variants/:id', async (req, res, next) => {
  try {
    const body = variantUpdateSchema.parse(req.body);
    const v = await prisma.productVariant.findUnique({ where: { id: req.params.id }, include: { inventory: true } });
    if (!v) return res.status(404).json({ error: 'Variant not found' });
    if (body.sku || body.name || body.priceCents) {
      await prisma.productVariant.update({ where: { id: v.id }, data: { sku: body.sku ?? v.sku, name: body.name ?? v.name, priceCents: body.priceCents ?? v.priceCents } });
    }
    if (body.stock !== undefined) {
      if (v.inventory) await prisma.inventory.update({ where: { variantId: v.id }, data: { quantity: body.stock } });
      else await prisma.inventory.create({ data: { variantId: v.id, quantity: body.stock } });
    }
    const updated = await prisma.productVariant.findUnique({ where: { id: v.id }, include: { inventory: true } });
    res.json(updated);
  } catch (err) { next(err); }
});

adminRouter.delete('/variants/:id', async (req, res, next) => {
  try {
    await prisma.inventory.deleteMany({ where: { variantId: req.params.id } });
    await prisma.productVariant.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

const productSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  sku: z.string().min(1),
  priceCents: z.number().int().positive(),
  currency: z.string().min(1).default('INR'),
  images: z.array(z.string().url()).default([]),
  categories: z.array(z.string().min(1)).default([]), // names or slugs
  care: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
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
        variants: {
          create: [
            {
              sku: body.sku,
              name: 'Default',
              priceCents: body.priceCents,
              currency: body.currency,
              inventory: { create: { quantity: body.stock ?? 0 } },
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
  care: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
});

adminRouter.patch('/products/:id', async (req, res, next) => {
  try {
    const body = updateProductSchema.parse(req.body);
    const prod = await prisma.product.findUnique({ where: { id: req.params.id }, include: { variants: { include: { inventory: true } } } });
    if (!prod) return res.status(404).json({ error: 'Not found' });

    const ops: any = { data: { } };
    if (body.title !== undefined) ops.data.title = body.title;
    if (body.description !== undefined) {
      ops.data.description = body.description;
      const meta = extractMetaFromDescription(body.description);
      if (meta.care !== undefined) ops.data.care = meta.care;
      if (meta.seoTitle !== undefined) ops.data.seoTitle = meta.seoTitle;
      if (meta.seoDescription !== undefined) ops.data.seoDescription = meta.seoDescription;
      if (meta.seoKeywords !== undefined) ops.data.seoKeywords = meta.seoKeywords;
    }
    if (body.active !== undefined) ops.data.active = body.active;
    if (body.slug !== undefined) ops.data.slug = body.slug;
    if (body.care !== undefined) ops.data.care = body.care;
    if (body.seoTitle !== undefined) ops.data.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) ops.data.seoDescription = body.seoDescription;
    if (body.seoKeywords !== undefined) ops.data.seoKeywords = body.seoKeywords;

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

    await prisma.product.update({ where: { id: req.params.id }, ...ops });

    // Update first variant sku/price/stock if provided
    if (prod.variants[0]) {
      if (body.sku || body.priceCents) {
        await prisma.productVariant.update({ where: { id: prod.variants[0].id }, data: { sku: body.sku ?? prod.variants[0].sku, priceCents: body.priceCents ?? prod.variants[0].priceCents } });
      }
      if (body.stock !== undefined) {
        if (prod.variants[0].inventory) {
          await prisma.inventory.update({ where: { variantId: prod.variants[0].id }, data: { quantity: body.stock } });
        } else {
          await prisma.inventory.create({ data: { variantId: prod.variants[0].id, quantity: body.stock } });
        }
      }
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
    const seoKeywords: string | undefined = Array.isArray(meta?.seo?.keywords) ? meta.seo.keywords.map((s: any)=>String(s)).join(', ') : undefined;
    return { care, seoTitle, seoDescription, seoKeywords };
  } catch { return {} as any; }
}
