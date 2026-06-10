const BASE = process.env.API_URL || 'http://localhost:5000/api';

const request = async (method, path, body) => {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json();
  return { status: res.status, data };
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const run = async () => {
  console.log('Running API tests against', BASE);

  const health = await request('GET', '/health');
  assert(health.status === 200 && health.data.success, 'Health check failed');
  console.log('✓ GET /api/health');

  const created = await request('POST', '/tasks', {
    title: 'Test task',
    description: 'API verification',
    priority: 'medium',
  });
  assert(created.status === 201 && created.data.data._id, 'Create task failed');
  const id = created.data.data._id;
  console.log('✓ POST /api/tasks');

  const list = await request('GET', '/tasks');
  assert(list.status === 200 && list.data.count >= 1, 'List tasks failed');
  console.log('✓ GET /api/tasks');

  const single = await request('GET', `/tasks/${id}`);
  assert(single.status === 200 && single.data.data._id === id, 'Get task by ID failed');
  console.log('✓ GET /api/tasks/:id');

  const updated = await request('PUT', `/tasks/${id}`, { completed: true });
  assert(updated.status === 200 && updated.data.data.completed === true, 'Update task failed');
  console.log('✓ PUT /api/tasks/:id');

  const invalid = await request('POST', '/tasks', {});
  assert(invalid.status === 400 && invalid.data.message === 'Validation failed', 'Validation failed');
  console.log('✓ POST validation (400 on missing title)');

  const removed = await request('DELETE', `/tasks/${id}`);
  assert(removed.status === 200 && removed.data.success, 'Delete task failed');
  console.log('✓ DELETE /api/tasks/:id');

  console.log('\nAll API tests passed.');
};

run().catch((err) => {
  console.error('\nAPI tests failed:', err.message);
  console.error('Make sure the server is running: npm run dev');
  process.exit(1);
});
