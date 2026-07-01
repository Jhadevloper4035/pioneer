const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeUser } = require("../services/authService");
const { listUsers } = require("../services/userRepository");

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = (await listUsers()).map(sanitizeUser);

    res.status(200).json({
      success: true,
      data: {
        total: users.length,
        users
      }
    });
  })
);

module.exports = router;
