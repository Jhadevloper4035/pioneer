const express = require("express");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const { clearSessionCookie, sessionCookie } = require("../utils/adminSessionCookie");
const asyncHandler = require("../utils/asyncHandler");
const authenticate = require("../middleware/authenticate");
const {
  loginValidator,
  registerValidator
} = require("../validators/authValidators");
const {
  getUserProfile,
  loginUser,
  registerUser
} = require("../services/authService");

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  asyncHandler(async (req, res) => {
    if (!env.allowPublicRegistration) {
      throw new AppError("Public registration is disabled", 403);
    }

    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Account created",
      data: result
    });
  })
);

router.post(
  "/login",
  loginValidator,
  asyncHandler(async (req, res) => {
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
      message: "Login successful",
      data: result
    });
  })
);

router.post("/logout", (req, res) => {
  res.setHeader("Set-Cookie", clearSessionCookie(env.nodeEnv === "production"));
  res.status(204).end();
});

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        user: await getUserProfile(req.user.id)
      }
    });
  })
);

module.exports = router;
