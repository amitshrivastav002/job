import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/prisma';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`API listening on port ${env.PORT} (${env.NODE_ENV})`);
});

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  server.close(() => logger.info('HTTP server closed'));
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
