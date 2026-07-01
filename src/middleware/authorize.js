const AppError = require("../utils/AppError");

function authorize(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    const hasRole = allowedRoles.some((role) => roles.includes(role));

    if (!hasRole) {
      return next(new AppError("You do not have permission to access this resource", 403));
    }

    return next();
  };
}

module.exports = authorize;
