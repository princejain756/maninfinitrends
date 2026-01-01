import express from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import { env } from './env';
import { cookies, sessionMiddleware } from './middleware/session';
import { cartRouter } from './routes/cart';
import { productsRouter } from './routes/products';
import { checkoutRouter } from './routes/checkout';
import { authRouter } from './routes/auth';
import { adminRouter } from './routes/admin';
import { attachUser } from './middleware/auth';
import { categoriesRouter } from './routes/categories';
import { materialsRouter } from './routes/materials';
import { ticketsRouter } from './routes/tickets';
import { ordersRouter } from './routes/orders';
import { paymentsRouter } from './routes/payments';
import { addressesRouter } from './routes/addresses';
import { wishlistRouter } from './routes/wishlist';
import { placeholderRouter } from './routes/placeholder';

const app = express();
// Behind nginx reverse proxy so req.protocol reflects HTTPS
app.set('trust proxy', 1);

// Enable gzip compression for all responses
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookies);
// Allow multiple origins (comma-separated in ORIGIN). Also allow localhost variants during development.
const allowedOrigins = (env.ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(sessionMiddleware);
app.use(attachUser);

// Static uploads directory served from dist/uploads for consistency in pm2/tsx and compiled modes
const uploadDir = path.resolve(process.cwd(), 'dist/uploads');
try { fs.mkdirSync(uploadDir, { recursive: true }); } catch { }
// Serve uploads with aggressive caching (1 year) since filenames are unique
app.use('/uploads', express.static(uploadDir, {
  maxAge: '1y',
  immutable: true,
  etag: true,
}));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/admin', adminRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/placeholder', placeholderRouter);

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(400).json({ error: err?.message || 'Unknown error' });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
