import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';
import { validate } from '../middleware/validate.js';
import { createEnrollmentSchema, updateEnrollmentSchema } from '../validators/schemas.js';

const router = Router();

// READ — GET /api/enrollments → SQL SELECT
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const enrollments = await prisma.enrollment.findMany({
      orderBy: { id: 'asc' },
      include: { student: true, course: true },
    });
    res.json({ data: enrollments });
  })
);

// CREATE — POST /api/enrollments → SQL INSERT (Many-to-Many link)
router.post(
  '/',
  validate(createEnrollmentSchema),
  asyncHandler(async (req, res) => {
    const { studentId, courseId, grade } = req.validated;

    const enrollment = await prisma.enrollment.create({
      data: { studentId, courseId, grade },
      include: { student: true, course: true },
    });

    res.status(201).json({ data: enrollment });
  })
);

// READ — GET /api/enrollments/:id → SQL SELECT
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: { student: true, course: true },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Not Found', message: 'Enrollment not found' });
    }

    res.json({ data: enrollment });
  })
);

// UPDATE — PATCH /api/enrollments/:id → SQL UPDATE (e.g. assign grade)
router.patch(
  '/:id',
  validate(updateEnrollmentSchema),
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: req.validated,
      include: { student: true, course: true },
    });

    res.json({ data: enrollment });
  })
);

// DELETE — DELETE /api/enrollments/:id → SQL DELETE (unenroll)
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    await prisma.enrollment.delete({ where: { id } });

    res.status(204).send();
  })
);

export default router;
