import express from 'express';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { prisma } from './lib/prisma.js';

const app = express();

app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1 AS alive`;
    res.json({
      status: 'ok',
      service: 'student-enrollment-api',
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      service: 'student-enrollment-api',
      database: 'disconnected',
    });
  }
});

app.use('/api', apiRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Route does not exist' });
});

app.use(errorHandler);

export default app;
