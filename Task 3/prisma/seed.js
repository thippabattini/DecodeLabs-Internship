import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.upsert({
    where: { email: 'alice@university.edu' },
    update: {},
    create: {
      email: 'alice@university.edu',
      fullName: 'Alice Johnson',
      dateOfBirth: new Date('2000-05-15'),
      profile: {
        create: {
          bio: 'Computer Science major',
          phone: '+1-555-0100',
        },
      },
    },
  });

  const course = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      credits: 3,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      courseId: course.id,
      grade: 'A',
    },
  });

  console.log('Seed data created:', { student: student.email, course: course.code });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
