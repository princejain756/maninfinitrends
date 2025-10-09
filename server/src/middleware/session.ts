import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { prisma } from '../db/client';
import { env } from '../env';
import { randomUUID } from 'node:crypto';

export const cookies = cookieParser();

declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = env.SESSION_COOKIE_NAME;
    let sid = req.cookies?.[name] as string | undefined;
    const now = new Date();
    const expires = new Date(now.getTime() + env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    if (sid) {
      const session = await prisma.session.findUnique({ where: { token: sid } });
      if (!session || session.expiresAt < now) {
        sid = undefined;
      }
    }

    if (!sid) {
      sid = randomUUID();
      await prisma.session.create({ data: { token: sid, expiresAt: expires } });
      res.cookie(name, sid, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires,
        path: '/',
      });
    } else {
      // Extend session TTL on activity
      await prisma.session.update({ where: { token: sid }, data: { expiresAt: expires } });
      res.cookie(name, sid, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires,
        path: '/',
      });
    }

    req.sessionId = sid;
    next();
  } catch (err) {
    next(err);
  }
};
