const express = require("express");
const systemController = require("../controllers/systemController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/pioneer-diagnostic", asyncHandler(systemController.diagnostic));
router.get("/health", systemController.health);

module.exports = router;
