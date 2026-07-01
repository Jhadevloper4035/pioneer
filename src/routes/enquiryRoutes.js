const express = require("express");
const enquiryController = require("../controllers/enquiryController");
const { contactValidator } = require("../validators/publicValidators");

const router = express.Router();

router.get(["/contact-us", "/contact-us.php"], enquiryController.contact);
router.post("/api/contact", contactValidator, enquiryController.submitContact);

module.exports = router;
