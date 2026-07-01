const AppError = require("../utils/AppError");

function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const isOperational = err.isOperational || statusCode < 500;
  const message = isOperational ? err.message : "Internal server error";

  if (!isOperational) {
    console.error(err);
  }

  const response = {
    success: false,
    status: `${statusCode}`.startsWith("4") ? "fail" : "error",
    message
  };

  if (err.details) {
    response.errors = err.details;
  }

  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}


module.exports = {
  errorHandler,
  notFoundHandler
};
