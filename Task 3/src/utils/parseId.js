export function parseId(param) {
  const id = Number(param);
  if (!Number.isInteger(id) || id < 1) {
    const error = new Error('Invalid ID parameter');
    error.statusCode = 400;
    throw error;
  }
  return id;
}
