import express from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { env } from './env';
import { cookies, sessionMiddleware } from './middleware/session';
import { cartRouter } from './routes/cart';
import { productsRouter } from './routes/products';
import { checkoutRouter } from './routes/checkout';
import { authRouter } from './routes/auth';
import { adminRouter } from './routes/admin';
import { attachUser } from './middleware/auth';
import { categoriesRouter } from './routes/categories';
import { ticketsRouter } from './routes/tickets';
import { ordersRouter } from './routes/orders';
import { paymentsRouter } from './routes/payments';

const app = express();
// Behind nginx reverse proxy so req.protocol reflects HTTPS
app.set('trust proxy', 1);

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookies);
app.use(cors({ origin: env.ORIGIN, credentials: true }));
app.use(sessionMiddleware);
app.use(attachUser);

// Static uploads directory served from dist/uploads for consistency in pm2/tsx and compiled modes
const uploadDir = path.resolve(process.cwd(), 'dist/uploads');
try { fs.mkdirSync(uploadDir, { recursive: true }); } catch {}
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/admin', adminRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);

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
