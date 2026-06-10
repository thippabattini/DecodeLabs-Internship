import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';
import { validate } from '../middleware/validate.js';
import { createCourseSchema, updateCourseSchema } from '../validators/schemas.js';

const router = Router();

// READ — GET /api/courses → SQL SELECT
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const courses = await prisma.course.findMany({ orderBy: { code: 'asc' } });
    res.json({ data: courses });
  })
);

// CREATE — POST /api/courses → SQL INSERT
router.post(
  '/',
  validate(createCourseSchema),
  asyncHandler(async (req, res) => {
    const course = await prisma.course.create({ data: req.validated });
    res.status(201).json({ data: course });
  })
);

// READ — GET /api/courses/:id → SQL SELECT
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    const course = await prisma.course.findUnique({
      where: { id },
      include: { enrollments: { include: { student: true } } },
    });

    if (!course) {
      return res.status(404).json({ error: 'Not Found', message: 'Course not found' });
    }

    res.json({ data: course });
  })
);

// UPDATE — PATCH /api/courses/:id → SQL UPDATE
router.patch(
  '/:id',
  validate(updateCourseSchema),
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    const course = await prisma.course.update({
      where: { id },
      data: req.validated,
    });

    res.json({ data: course });
  })
);

// DELETE — DELETE /api/courses/:id → SQL DELETE
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    await prisma.course.delete({ where: { id } });

    res.status(204).send();
  })
);

// READ — GET /api/courses/:id/students → SQL SELECT with JOIN
router.get(
  '/:id/students',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return res.status(404).json({ error: 'Not Found', message: 'Course not found' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: id },
      include: { student: true },
    });

    res.json({ data: enrollments });
  })
);

export default router;
