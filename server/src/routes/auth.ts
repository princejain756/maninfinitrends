import { Router } from 'express';
import { prisma } from '../db/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { env } from '../env';
import { OAuth2Client } from 'google-auth-library';
import { randomBytes } from 'crypto';

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
    const user = session?.user ? { id: session.user.id, email: session.user.email, username: session.user.username, role: session.user.role, name: session.user.name } : null;
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

// ---- Google OAuth (OpenID Connect) ----
const googleClient = new OAuth2Client();

authRouter.get('/google/start', async (req, res) => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
    return res.status(500).json({ error: 'Google auth is not configured' });
  }
  // Use session token as CSRF state token
  const state = encodeURIComponent(req.sessionId || '');
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    access_type: 'offline',
    state,
  });
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.redirect(url);
});

authRouter.get('/google/callback', async (req, res, next) => {
  try {
    if (!req.sessionId) throw new Error('No session');
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REDIRECT_URI) {
      throw new Error('Google auth is not configured');
    }

    const { code, state } = req.query as { code?: string; state?: string };
    if (!code) return res.status(400).json({ error: 'Missing code' });
    if (!state || decodeURIComponent(state) !== req.sessionId) return res.status(400).json({ error: 'Invalid state' });

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    const tokenJson: any = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(tokenJson?.error || 'Token exchange failed');

    const idToken = tokenJson.id_token as string;
    if (!idToken) throw new Error('No id_token received');

    // Verify ID token and extract profile
    const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error('Email not found in Google profile');

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split('@')[0];

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, name, role: 'USER' } });
    }

    await prisma.session.update({ where: { token: req.sessionId }, data: { userId: user.id } });

    // Redirect to account/orders on success
    const redirectUrl = `${env.ORIGIN}/account/orders`;
    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
});

// --- Password reset ---
const requestSchema = z.object({ email: z.string().email() });
authRouter.post('/request-reset', async (req, res, next) => {
  try {
    const { email } = requestSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await prisma.passwordReset.create({ data: { userId: user.id, token, expiresAt } });
      // In production, send email with link: `${env.ORIGIN}/account/reset?token=${token}`
      console.log(`[password-reset] link for ${email}: ${env.ORIGIN}/account/reset?token=${token}`);
    }
    // Always respond OK to avoid user enumeration
    res.json({ ok: true });
  } catch (err) { next(err); }
});

const resetSchema = z.object({ token: z.string().min(10), password: z.string().min(6) });
authRouter.post('/reset', async (req, res, next) => {
  try {
    const { token, password } = resetSchema.parse(req.body);
    const pr = await prisma.passwordReset.findUnique({ where: { token } });
    if (!pr || pr.usedAt || pr.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' });
    const hash = await bcrypt.hash(password, 10);
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: pr.userId }, data: { password: hash } });
      await tx.passwordReset.update({ where: { token }, data: { usedAt: new Date() } });
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
});
