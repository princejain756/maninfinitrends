import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: 'USER' | 'ADMIN';
      email?: string | null;
      username?: string | null;
    };
  }
}

