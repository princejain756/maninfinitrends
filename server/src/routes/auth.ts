import { Router } from 'express';
import { prisma } from '../db/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

export const authRouter = Router();

const loginSchema = z.object({
  username: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6),
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    if (!body.username && !body.email) throw new Error('username or email is required');

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          body.username ? { username: body.username } : undefined,
          body.email ? { email: body.email } : undefined,
        ].filter(Boolean) as any,
      },
    });
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(body.password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    if (!req.sessionId) throw new Error('No session');
    await prisma.session.update({ where: { token: req.sessionId }, data: { userId: user.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/logout', async (req, res, next) => {
  try {
    if (req.sessionId) {
      await prisma.session.updateMany({ where: { token: req.sessionId }, data: { userId: null } });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', async (req, res, next) => {
  try {
    if (!req.sessionId) return res.json({ user: null });
    const session = await prisma.session.findUnique({ where: { token: req.sessionId }, include: { user: true } });
    const user = session?.user ? { id: session.user.id, email: session.user.email, username: session.user.username, role: session.user.role } : null;
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// Register new user
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  username: z.string().min(3).max(50).optional(),
});

authRouter.post('/register', async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const exists = await prisma.user.findFirst({ where: { OR: [{ email: body.email }, body.username ? { username: body.username } : undefined].filter(Boolean) as any } });
    if (exists) return res.status(400).json({ error: 'User already exists' });
    const password = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({ data: { email: body.email, username: body.username, name: body.name, password, role: 'USER' } });
    if (!req.sessionId) throw new Error('No session');
    await prisma.session.update({ where: { token: req.sessionId }, data: { userId: user.id } });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});
