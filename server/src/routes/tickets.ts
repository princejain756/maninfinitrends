import { Router } from 'express';
import { prisma } from '../db/client';
import { z } from 'zod';

export const ticketsRouter = Router();

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(5),
});

ticketsRouter.post('/', async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const t = await prisma.supportTicket.create({ data: body });
    res.status(201).json(t);
  } catch (err) { next(err); }
});

