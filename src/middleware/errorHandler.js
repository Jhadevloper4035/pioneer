const AppError = require("../utils/AppError");
const { renderPublicPage } = require("../services/viewRenderer");

function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function wantsJson(req) {
  return req.originalUrl.startsWith("/api/")
    || req.xhr
    || req.accepts(["html", "json"]) === "json";
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

  if (statusCode === 404 && !wantsJson(req)) {
    res.status(404);
    return renderPublicPage(req, res, "public/pages/error/404", {
      requestedUrl: req.originalUrl
    }).catch(next);
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
