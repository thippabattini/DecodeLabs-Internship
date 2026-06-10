export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    try {
      req.validated = schema.parse(req[source]);
      next();
    } catch (err) {
      next(err);
    }
  };
}
