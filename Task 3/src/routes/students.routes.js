import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';
import { validate } from '../middleware/validate.js';
import {
  createStudentSchema,
  updateStudentSchema,
  upsertProfileSchema,
} from '../validators/schemas.js';

const router = Router();

// READ — GET /api/students → SQL SELECT
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const students = await prisma.student.findMany({
      orderBy: { id: 'asc' },
      include: { profile: true },
    });
    res.json({ data: students });
  })
);

// CREATE — POST /api/students → SQL INSERT
router.post(
  '/',
  validate(createStudentSchema),
  asyncHandler(async (req, res) => {
    const { email, fullName, dateOfBirth, profile } = req.validated;

    const student = await prisma.student.create({
      data: {
        email,
        fullName,
        dateOfBirth,
        ...(profile && { profile: { create: profile } }),
      },
      include: { profile: true },
    });

    res.status(201).json({ data: student });
  })
);

// READ — GET /api/students/:id → SQL SELECT
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    const student = await prisma.student.findUnique({
      where: { id },
      include: { profile: true, enrollments: { include: { course: true } } },
    });

    if (!student) {
      return res.status(404).json({ error: 'Not Found', message: 'Student not found' });
    }

    res.json({ data: student });
  })
);

// UPDATE — PATCH /api/students/:id → SQL UPDATE
router.patch(
  '/:id',
  validate(updateStudentSchema),
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    const student = await prisma.student.update({
      where: { id },
      data: req.validated,
      include: { profile: true },
    });

    res.json({ data: student });
  })
);

// DELETE — DELETE /api/students/:id → SQL DELETE
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    await prisma.student.delete({ where: { id } });

    res.status(204).send();
  })
);

// READ — GET /api/students/:id/courses → SQL SELECT with JOIN
router.get(
  '/:id/courses',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return res.status(404).json({ error: 'Not Found', message: 'Student not found' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: id },
      include: { course: true },
    });

    res.json({ data: enrollments });
  })
);

// CREATE/UPDATE — PUT /api/students/:id/profile → SQL INSERT or UPDATE (One-to-One)
router.put(
  '/:id/profile',
  validate(upsertProfileSchema),
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return res.status(404).json({ error: 'Not Found', message: 'Student not found' });
    }

    const profile = await prisma.studentProfile.upsert({
      where: { studentId: id },
      update: req.validated,
      create: { studentId: id, ...req.validated },
    });

    res.json({ data: profile });
  })
);

export default router;
