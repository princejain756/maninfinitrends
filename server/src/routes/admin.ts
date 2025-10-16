import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';
import { requireAdmin } from '../middleware/auth';

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

