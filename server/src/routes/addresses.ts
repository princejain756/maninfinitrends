import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';
import { requireAuth } from '../middleware/auth';

export const addressesRouter = Router();

const addressSchema = z.object({
  label: z.string().max(50).optional(),
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(4).max(10),
  country: z.string().min(2).max(2).default('IN'),
  phone: z.string().optional(),
});

// List saved addresses for current user
addressesRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    res.json(addresses);
  } catch (err) { next(err); }
});

// Create new address
addressesRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const body = addressSchema.parse(req.body);
    const addr = await prisma.address.create({ data: { userId, ...body } });
    res.status(201).json(addr);
  } catch (err) { next(err); }
});

// Update address
addressesRouter.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;
    const body = addressSchema.partial().parse(req.body);
    // Ensure ownership
    const exists = await prisma.address.findFirst({ where: { id, userId } });
    if (!exists) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.address.update({ where: { id }, data: body });
    res.json(updated);
  } catch (err) { next(err); }
});

// Delete address
addressesRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;
    const exists = await prisma.address.findFirst({ where: { id, userId } });
    if (!exists) return res.status(404).json({ error: 'Not found' });
    await prisma.address.delete({ where: { id } });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default addressesRouter;
