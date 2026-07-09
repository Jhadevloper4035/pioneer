const env = require("../config/env");
const AppError = require("../utils/AppError");
const { getCookie } = require("../utils/adminSessionCookie");
const { verifyJwt } = require("../utils/jwt");
const { findUserById } = require("../services/userRepository");

async function authenticate(req, res, next) {
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  const sessionToken = scheme === "Bearer" ? token : getCookie(req);

  if (!sessionToken) {
    return next(new AppError("Authorization token is required", 401));
  }

  try {
    const payload = verifyJwt(sessionToken, {
      audience: env.jwtAudience,
      issuer: env.jwtIssuer,
      secret: env.jwtSecret
    });
    const user = await findUserById(payload.sub);

    if (!user) {
      return next(new AppError("Authenticated user no longer exists", 401));
    }

    req.auth = payload;
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authenticate;
