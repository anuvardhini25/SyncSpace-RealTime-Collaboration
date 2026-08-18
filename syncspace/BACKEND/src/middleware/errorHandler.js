const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode || 500;

  console.error("API Error:", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: err.message,
  });

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message || "Something went wrong",
  });
};

export { notFound, errorHandler };