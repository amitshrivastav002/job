import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { logger } from './config/logger';
import { swaggerSpec } from './config/swagger';
import { globalRateLimiter } from './middleware/rateLimit';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(pinoHttp({ logger }));
  app.use(globalRateLimiter);

  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
