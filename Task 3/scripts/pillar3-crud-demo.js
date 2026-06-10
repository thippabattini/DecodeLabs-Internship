/**
 * Pillar 3 — CRUD & RESTful HTTP demonstration.
 * Requires server running: npm run dev
 * Run: npm run pillar3:demo
 */
const BASE = process.env.API_URL || 'http://localhost:3000/api';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { status: res.status, data };
}

function log(step, method, path, result) {
  const sql = { POST: 'INSERT', GET: 'SELECT', PATCH: 'UPDATE', DELETE: 'DELETE', PUT: 'INSERT/UPDATE' };
  console.log(`\n${step}. ${method} ${path} → SQL ${sql[method]}`);
  console.log(`   Status: ${result.status}`);
  if (result.data) console.log(`   Response:`, JSON.stringify(result.data, null, 2).split('\n').join('\n   '));
}

async function main() {
  console.log('\n=== Pillar 3: CRUD & RESTful HTTP ===\n');

  const health = await fetch('http://localhost:3000/health');
  if (!health.ok) {
    console.error('Server not running. Start it first: npm run dev');
    process.exit(1);
  }

  let r;

  r = await request('POST', '/courses', { code: 'CS201', title: 'Data Structures', credits: 4 });
  log('1', 'POST', '/api/courses', r);
  const courseId = r.data?.data?.id;

  r = await request('POST', '/students', {
    email: 'bob@university.edu',
    fullName: 'Bob Smith',
    dateOfBirth: '1999-03-20',
    profile: { bio: 'Engineering student', phone: '+1-555-0200' },
  });
  log('2', 'POST', '/api/students', r);
  const studentId = r.data?.data?.id;

  r = await request('POST', '/enrollments', { studentId, courseId, grade: 'B' });
  log('3', 'POST', '/api/enrollments', r);
  const enrollmentId = r.data?.data?.id;

  r = await request('GET', '/students');
  log('4', 'GET', '/api/students', r);

  r = await request('GET', `/students/${studentId}/courses`);
  log('5', 'GET', `/api/students/${studentId}/courses`, r);

  r = await request('PATCH', `/enrollments/${enrollmentId}`, { grade: 'A' });
  log('6', 'PATCH', `/api/enrollments/${enrollmentId}`, r);

  r = await request('DELETE', `/enrollments/${enrollmentId}`);
  log('7', 'DELETE', `/api/enrollments/${enrollmentId}`, r);

  console.log('\n=== All CRUD operations completed ===\n');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
