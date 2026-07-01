const express = require("express");
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

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  })
);

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
