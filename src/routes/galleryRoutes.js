const express = require("express");
const galleryController = require("../controllers/galleryController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/gallery", asyncHandler(galleryController.gallery));

module.exports = router;
