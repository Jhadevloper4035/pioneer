const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

function handleValidation(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((error) => ({
    field: error.path,
    location: error.location,
    message: error.msg
  }));

  return next(new AppError("Validation failed", 422, errors));
}

module.exports = handleValidation;
