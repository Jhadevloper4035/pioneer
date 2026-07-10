const express = require("express");
const adminApiController = require("../controllers/adminApiController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/users", asyncHandler(adminApiController.users));
router.get("/seo", asyncHandler(adminApiController.seoPages));
router.get("/seo/page", asyncHandler(adminApiController.seoPage));
router.put("/seo/page", asyncHandler(adminApiController.saveSeoPage));
router.delete("/seo/page", asyncHandler(adminApiController.removeSeoPage));

module.exports = router;
