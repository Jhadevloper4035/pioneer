const express = require("express");
const enquiryController = require("../controllers/enquiryController");
const resumeUpload = require("../middleware/resumeUpload");
const verifyRecaptcha = require("../middleware/verifyRecaptcha");
const asyncHandler = require("../utils/asyncHandler");
const {
  contactValidator,
  enquiryValidator,
  productEnquiryValidator
} = require("../validators/publicValidators");

const router = express.Router();

router.get("/contact-us", asyncHandler(enquiryController.contact));
router.get("/resume/:token", asyncHandler(enquiryController.downloadPublicCareerResume));
router.post("/api/contact", contactValidator, verifyRecaptcha("contact"), asyncHandler(enquiryController.submitContact));
router.post("/api/enquiries", enquiryValidator, verifyRecaptcha("homepage_enquiry"), asyncHandler(enquiryController.submitEnquiry));
router.post(
  "/api/product-enquiries",
  productEnquiryValidator,
  verifyRecaptcha("product_enquiry"),
  asyncHandler(enquiryController.submitProductEnquiry)
);
router.post(
  "/api/career-application",
  resumeUpload,
  verifyRecaptcha("career_application"),
  asyncHandler(enquiryController.submitCareerApplication)
);

module.exports = router;
