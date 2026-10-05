const express = require("express");
const adminApiController = require("../controllers/adminApiController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");
const { jobPostIdValidator, jobPostValidator } = require("../validators/adminValidators");

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/users", asyncHandler(adminApiController.users));
router.get("/job-posts", asyncHandler(adminApiController.jobPosts));
router.post("/job-posts", jobPostValidator, asyncHandler(adminApiController.createJobPost));
router.put("/job-posts/:id", jobPostIdValidator, jobPostValidator, asyncHandler(adminApiController.updateJobPost));
router.delete("/job-posts/:id", jobPostIdValidator, asyncHandler(adminApiController.deleteJobPost));
router.get("/seo", asyncHandler(adminApiController.seoPages));
router.get("/seo/page", asyncHandler(adminApiController.seoPage));
router.put("/seo/page", asyncHandler(adminApiController.saveSeoPage));
router.delete("/seo/page", asyncHandler(adminApiController.removeSeoPage));

module.exports = router;
