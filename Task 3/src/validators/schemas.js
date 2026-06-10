import { z } from 'zod';

const GRADES = ['A', 'B', 'C', 'D', 'F'];

function isAtLeast18(date) {
  const today = new Date();
  const birth = new Date(date);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= 18;
}

const dateOfBirthSchema = z.coerce.date().refine(isAtLeast18, {
  message: 'Student must be at least 18 years old',
});

export const createStudentSchema = z.object({
  email: z.email(),
  fullName: z.string().trim().min(1).max(255),
  dateOfBirth: dateOfBirthSchema,
  profile: z
    .object({
      bio: z.string().optional(),
      phone: z.string().max(20).optional(),
    })
    .optional(),
});

export const updateStudentSchema = z
  .object({
    email: z.email().optional(),
    fullName: z.string().trim().min(1).max(255).optional(),
    dateOfBirth: dateOfBirthSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });

export const upsertProfileSchema = z.object({
  bio: z.string().optional(),
  phone: z.string().max(20).optional(),
});

export const createCourseSchema = z.object({
  code: z.string().trim().min(1).max(20),
  title: z.string().trim().min(1).max(255),
  credits: z.coerce.number().int().min(1).max(6),
});

export const updateCourseSchema = z
  .object({
    code: z.string().trim().min(1).max(20).optional(),
    title: z.string().trim().min(1).max(255).optional(),
    credits: z.coerce.number().int().min(1).max(6).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });

export const createEnrollmentSchema = z.object({
  studentId: z.coerce.number().int().positive(),
  courseId: z.coerce.number().int().positive(),
  grade: z.enum(GRADES).optional(),
});

export const updateEnrollmentSchema = z.object({
  grade: z.enum(GRADES).nullable(),
});
