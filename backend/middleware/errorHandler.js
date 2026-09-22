export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'That already exists.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on our end.',
  });
}
