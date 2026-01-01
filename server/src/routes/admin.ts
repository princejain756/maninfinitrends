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

// Update a category (name and optional slug)
adminRouter.patch('/categories/:id', async (req, res, next) => {
  try {
    const schema = z.object({ name: z.string().min(1).optional(), slug: z.string().min(1).optional() });
    const body = schema.parse(req.body || {});

    const id = req.params.id;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Category not found' });

    const data: Record<string, any> = {};
    if (body.name !== undefined) data.name = toTitleCase(body.name);
    if (body.slug !== undefined) {
      const slug = toSlug(body.slug);
      if (!slug) return res.status(400).json({ error: 'Invalid slug' });
      // If slug unchanged, skip check
      if (slug !== existing.slug) {
        const taken = await prisma.category.findUnique({ where: { slug } });
        if (taken && taken.id !== id) return res.status(400).json({ error: 'Slug already exists' });
      }
      data.slug = slug;
    }

    const updated = await prisma.category.update({ where: { id }, data });
    res.json(updated);
  } catch (err) { next(err); }
});

// Delete a category. If in use, requires force=1 to detach product links first.
adminRouter.delete('/categories/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    const inUse = await prisma.productCategory.count({ where: { categoryId: id } });
    const force = String(req.query.force || '').toLowerCase() === '1' || ['true','yes','y'].includes(String(req.query.force || '').toLowerCase());
    if (inUse > 0 && !force) {
      return res.status(400).json({ error: 'Category in use', productCount: inUse });
    }
    if (inUse > 0) {
      await prisma.productCategory.deleteMany({ where: { categoryId: id } });
    }
    await prisma.category.delete({ where: { id } });
    res.json({ ok: true, detached: inUse });
  } catch (err) { next(err); }
});

// Update a material (name and optional slug)
adminRouter.patch('/materials/:id', async (req, res, next) => {
  try {
    const schema = z.object({ name: z.string().min(1).optional(), slug: z.string().min(1).optional() });
    const body = schema.parse(req.body || {});

    const id = req.params.id;
    const existing = await prisma.material.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Material not found' });

    const data: Record<string, any> = {};
    if (body.name !== undefined) data.name = toTitleCase(body.name);
    if (body.slug !== undefined) {
      const slug = toSlug(body.slug);
      if (!slug) return res.status(400).json({ error: 'Invalid slug' });
      if (slug !== existing.slug) {
        const taken = await prisma.material.findUnique({ where: { slug } });
        if (taken && taken.id !== id) return res.status(400).json({ error: 'Slug already exists' });
      }
      data.slug = slug;
    }

    const updated = await prisma.material.update({ where: { id }, data });
    res.json(updated);
  } catch (err) { next(err); }
});

// Delete a material. If in use, requires force=1 to detach product links first.
adminRouter.delete('/materials/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const mat = await prisma.material.findUnique({ where: { id } });
    if (!mat) return res.status(404).json({ error: 'Material not found' });
    const inUse = await prisma.productMaterial.count({ where: { materialId: id } });
    const force = String(req.query.force || '').toLowerCase() === '1' || ['true','yes','y'].includes(String(req.query.force || '').toLowerCase());
    if (inUse > 0 && !force) {
      return res.status(400).json({ error: 'Material in use', productCount: inUse });
    }
    if (inUse > 0) {
      await prisma.productMaterial.deleteMany({ where: { materialId: id } });
    }
    await prisma.material.delete({ where: { id } });
    res.json({ ok: true, detached: inUse });
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
const variantCreateSchema = z.object({ sku: z.string().min(1), name: z.string().min(1), priceCents: z.number().int().nonnegative(), compareAtPriceCents: z.number().int().nonnegative().optional(), stock: z.number().int().nonnegative().optional(), currency: z.string().default('INR') });
adminRouter.post('/products/:id/variants', async (req, res, next) => {
  try {
    const data = variantCreateSchema.parse(req.body);
    const variant = await prisma.productVariant.create({ data: { productId: req.params.id, sku: data.sku, name: data.name, priceCents: data.priceCents, compareAtPriceCents: data.compareAtPriceCents, currency: data.currency, inventory: { create: { quantity: data.stock ?? 0 } } } });
    res.status(201).json(variant);
  } catch (err) { next(err); }
});

const variantUpdateSchema = z.object({ sku: z.string().min(1).optional(), name: z.string().min(1).optional(), priceCents: z.number().int().nonnegative().optional(), compareAtPriceCents: z.number().int().nonnegative().optional(), stock: z.number().int().nonnegative().optional() });
adminRouter.patch('/variants/:id', async (req, res, next) => {
  try {
    const body = variantUpdateSchema.parse(req.body);
    const v = await prisma.productVariant.findUnique({ where: { id: req.params.id }, include: { inventory: true } });
    if (!v) return res.status(404).json({ error: 'Variant not found' });
    if (body.sku || body.name || body.priceCents || body.compareAtPriceCents !== undefined) {
      await prisma.productVariant.update({ where: { id: v.id }, data: { sku: body.sku ?? v.sku, name: body.name ?? v.name, priceCents: body.priceCents ?? v.priceCents, compareAtPriceCents: body.compareAtPriceCents ?? v.compareAtPriceCents } });
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
  compareAtPriceCents: z.number().int().positive().optional(),
  currency: z.string().min(1).default('INR'),
  images: z.array(z.string().url()).default([]),
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
  images: z.array(z.string().url()).optional(),
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

    const ops: any = { data: { } };
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
    const schema = z.object({ status: z.enum(['PENDING','PAID','FULFILLED','CANCELLED','REFUNDED']) });
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
    const specs: Record<string,string> | undefined = meta?.specs && typeof meta.specs === 'object' ? Object.fromEntries(Object.entries(meta.specs).map(([k,v]: any)=>[String(k), String(v)])) : undefined;
    return { care, seoTitle, seoDescription, seoKeywords, specs } as any;
  } catch { return {} as any; }
}
