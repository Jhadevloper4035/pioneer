const express = require("express");
const catalogueController = require("../controllers/catalogueController");
const asyncHandler = require("../utils/asyncHandler");
const verifyRecaptcha = require("../middleware/verifyRecaptcha");
const { catalogueLeadValidator } = require("../validators/publicValidators");

const router = express.Router();

router.get("/e-catalogue", asyncHandler(catalogueController.eCatalogue));
router.post(
  "/api/e-catalogue-leads",
  catalogueLeadValidator,
  verifyRecaptcha("catalogue_lead"),
  asyncHandler(catalogueController.submitCatalogueLead)
);

module.exports = router;
