const express = require("express");
const enquiryController = require("../controllers/enquiryController");
const resumeUpload = require("../middleware/resumeUpload");
const asyncHandler = require("../utils/asyncHandler");
const { contactValidator } = require("../validators/publicValidators");

const router = express.Router();

router.get(["/contact-us", "/contact-us.php"], asyncHandler(enquiryController.contact));
router.post("/api/contact", contactValidator, enquiryController.submitContact);
router.post(
  "/api/career-application",
  resumeUpload,
  asyncHandler(enquiryController.submitCareerApplication)
);

module.exports = router;
