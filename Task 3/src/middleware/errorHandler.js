import { Prisma } from '@prisma/client';

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A record with this unique value already exists.',
        fields: err.meta?.target,
      });
    }

    if (err.code === 'P2003') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Related record not found (foreign key constraint).',
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Record not found.',
      });
    }
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.issues ?? err.errors,
    });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message,
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}
