import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/client';

export const attachUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const sid = req.sessionId;
    if (!sid) return next();
    const session = await prisma.session.findUnique({ where: { token: sid }, include: { user: true } });
    req.user = session?.user ? {
      id: session.user.id,
      role: session.user.role as any,
      email: session.user.email,
      username: session.user.username ?? undefined,
    } : undefined;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as { id: string; role: string } | null | undefined;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as { id: string; role: string } | null | undefined;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  next();
};
