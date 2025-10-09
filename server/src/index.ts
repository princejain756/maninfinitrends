import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { env } from './env';
import { cookies, sessionMiddleware } from './middleware/session';
import { cartRouter } from './routes/cart';
import { productsRouter } from './routes/products';
import { checkoutRouter } from './routes/checkout';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookies);
app.use(cors({ origin: env.ORIGIN, credentials: true }));
app.use(sessionMiddleware);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/cart', cartRouter);
app.use('/api/products', productsRouter);
app.use('/api/checkout', checkoutRouter);

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
