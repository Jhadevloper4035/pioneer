const express = require("express");
const catalogueController = require("../controllers/catalogueController");
const asyncHandler = require("../utils/asyncHandler");
const { catalogueLeadValidator } = require("../validators/publicValidators");

const router = express.Router();

router.get(["/e-catalogue", "/e-catalogue.php", "/e-catalog"], asyncHandler(catalogueController.eCatalogue));
router.post(
  "/api/e-catalogue-leads",
  catalogueLeadValidator,
  asyncHandler(catalogueController.submitCatalogueLead)
);

module.exports = router;
