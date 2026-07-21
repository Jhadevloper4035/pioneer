const env = require("../config/env");
const { getUserProfile, loginUser, registerUser } = require("../services/authService");
const { getSiteSetting } = require("../services/siteSettingService");
const AppError = require("../utils/AppError");
const { clearSessionCookie, sessionCookie } = require("../utils/adminSessionCookie");

async function register(req, res) {
  const messages = await getSiteSetting("responseMessages");

  if (!env.allowPublicRegistration) {
    throw new AppError(messages.auth.registrationDisabled, 403);
  }

  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: messages.auth.accountCreated,
    data: result
  });
}

async function login(req, res) {
  const messages = await getSiteSetting("responseMessages");
  const result = await loginUser(req.body);
  const isAdmin = result.user.roles.includes("admin");

  if (isAdmin) {
    res.setHeader(
      "Set-Cookie",
      sessionCookie(result.token, result.expiresIn, env.nodeEnv === "production")
    );
  }

  res.status(200).json({
    success: true,
    message: messages.auth.loginSuccessful,
    data: result
  });
}

function logout(req, res) {
  res.setHeader("Set-Cookie", clearSessionCookie(env.nodeEnv === "production"));
  res.status(204).end();
}

async function me(req, res) {
  res.status(200).json({
    success: true,
    data: {
      user: await getUserProfile(req.user.id)
    }
  });
}

module.exports = {
  login,
  logout,
  me,
  register
};
