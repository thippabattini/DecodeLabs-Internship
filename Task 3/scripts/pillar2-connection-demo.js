/**
 * Pillar 2 — Integration & Connection demonstration.
 * Run: npm run pillar2:demo
 */
import 'dotenv/config';
import { connectDatabase, disconnectDatabase, prisma } from '../src/lib/prisma.js';

function parseConnectionUrl(url) {
  const match = url?.match(/^postgresql:\/\/([^:]+):.*@([^:]+):(\d+)\/(.+)$/);
  if (!match) return null;
  return { user: match[1], host: match[2], port: match[3], database: match[4] };
}

async function main() {
  console.log('\n=== Pillar 2: Integration & Connection ===\n');

  const config = parseConnectionUrl(process.env.DATABASE_URL);
  if (config) {
    console.log('Connection string breakdown (password hidden):');
    console.log(`  User:     ${config.user}`);
    console.log(`  Host:     ${config.host}`);
    console.log(`  Port:     ${config.port}`);
    console.log(`  Database: ${config.database}\n`);
  }

  console.log('Step 1: Connecting via Prisma...');
  await connectDatabase();
  console.log('  ✅ prisma.$connect() succeeded\n');

  console.log('Step 2: ORM query — prisma.student.findMany()');
  const students = await prisma.student.findMany({
    select: { id: true, email: true, fullName: true },
  });
  console.log(`  Found ${students.length} student(s):`, students);
  console.log('  → Prisma generates parameterized SQL automatically\n');

  console.log('Step 3: Raw SQL with parameters — prisma.$queryRaw');
  const courseCount = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS count FROM courses WHERE credits >= ${3}
  `;
  console.log(`  Courses with 3+ credits: ${courseCount[0].count}`);
  console.log('  → $queryRaw uses tagged templates — values are parameterized (safe)\n');

  console.log('Step 4: JOIN across related tables');
  const enrollments = await prisma.enrollment.findMany({
    take: 3,
    include: { student: { select: { fullName: true } }, course: { select: { code: true } } },
  });
  enrollments.forEach((e) => {
    console.log(`  ${e.student.fullName} enrolled in ${e.course.code} (grade: ${e.grade ?? 'pending'})`);
  });

  console.log('\n--- ORM vs Native Driver (pg) ---');
  console.log('| Approach      | Pros                          | Cons                    |');
  console.log('|---------------|-------------------------------|-------------------------|');
  console.log('| Prisma (ours) | Type-safe, migrations, joins  | Abstraction overhead    |');
  console.log('| pg (native)   | Raw SQL, max control          | Manual mapping, verbose |');
  console.log('\nWe chose Prisma: relationship-heavy schema, training focus,');
  console.log('built-in parameterization for SQL injection protection.\n');

  await disconnectDatabase();
  console.log('Step 5: Disconnected cleanly via prisma.$disconnect()\n');
}

main().catch((err) => {
  console.error('Connection failed:', err.message);
  process.exit(1);
});
