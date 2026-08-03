const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`[${req.method} ${req.originalUrl}]`, err.message);
  if (!err.isOperational) {
    console.error(err.stack); // full stack only for real bugs, not expected errors
  }

  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : "Something went wrong",
  });
};

export default errorHandler;