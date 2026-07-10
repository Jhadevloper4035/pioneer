const express = require("express");
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");
const asyncHandler = require("../utils/asyncHandler");
const {
  loginValidator,
  registerValidator
} = require("../validators/authValidators");

const router = express.Router();

router.post("/register", registerValidator, asyncHandler(authController.register));
router.post("/login", loginValidator, asyncHandler(authController.login));
router.post("/logout", authController.logout);
router.get("/me", authenticate, asyncHandler(authController.me));

module.exports = router;
