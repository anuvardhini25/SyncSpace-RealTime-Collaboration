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

module.exports = errorHandler;
