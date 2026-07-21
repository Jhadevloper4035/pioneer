const express = require("express");
const enquiryController = require("../controllers/enquiryController");
const resumeUpload = require("../middleware/resumeUpload");
const asyncHandler = require("../utils/asyncHandler");
const {
  contactValidator,
  enquiryValidator,
  productEnquiryValidator
} = require("../validators/publicValidators");

const router = express.Router();

router.get("/contact-us", asyncHandler(enquiryController.contact));
router.post("/api/contact", contactValidator, asyncHandler(enquiryController.submitContact));
router.post("/api/enquiries", enquiryValidator, asyncHandler(enquiryController.submitEnquiry));
router.post(
  "/api/product-enquiries",
  productEnquiryValidator,
  asyncHandler(enquiryController.submitProductEnquiry)
);
router.post(
  "/api/career-application",
  resumeUpload,
  asyncHandler(enquiryController.submitCareerApplication)
);

module.exports = router;
