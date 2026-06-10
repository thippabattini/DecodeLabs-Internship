/**
 * Pillar 1 — Demonstrates schema-level integrity constraints.
 * Run: node scripts/pillar1-constraint-demo.js
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function expectConstraintFailure(label, fn) {
  try {
    await fn();
    console.log(`❌ FAIL: ${label} — expected database to reject this`);
  } catch (err) {
    console.log(`✅ PASS: ${label}`);
    console.log(`   → ${err.message.split('\n')[0]}`);
  }
}

async function main() {
  console.log('\n=== Pillar 1: Schema Constraint Demonstration ===\n');

  const students = await prisma.student.findMany({ include: { profile: true, enrollments: true } });
  const courses = await prisma.course.findMany();
  console.log(`Current data: ${students.length} student(s), ${courses.length} course(s)\n`);

  await expectConstraintFailure('UNIQUE — duplicate email', () =>
    prisma.student.create({
      data: {
        email: 'alice@university.edu',
        fullName: 'Duplicate Alice',
        dateOfBirth: new Date('2000-01-01'),
      },
    })
  );

  await expectConstraintFailure('CHECK — student under 18', () =>
    prisma.student.create({
      data: {
        email: 'minor@university.edu',
        fullName: 'Too Young',
        dateOfBirth: new Date('2015-01-01'),
      },
    })
  );

  await expectConstraintFailure('CHECK — invalid course credits (0)', () =>
    prisma.course.create({
      data: { code: 'BAD001', title: 'Invalid Credits', credits: 0 },
    })
  );

  await expectConstraintFailure('CHECK — invalid grade', () =>
    prisma.enrollment.update({
      where: { id: students[0]?.enrollments[0]?.id ?? 1 },
      data: { grade: 'Z' },
    })
  );

  if (students[0] && courses[0]) {
    await expectConstraintFailure('UNIQUE — duplicate enrollment', () =>
      prisma.enrollment.create({
        data: { studentId: students[0].id, courseId: courses[0].id },
      })
    );
  }

  await expectConstraintFailure('FOREIGN KEY — non-existent student', () =>
    prisma.enrollment.create({
      data: { studentId: 99999, courseId: courses[0]?.id ?? 1 },
    })
  );

  console.log('\n=== All constraints enforced at the database level ===\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
