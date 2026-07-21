const express = require("express");
const homeController = require("../controllers/homeController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(homeController.home));
router.get("/about-company", asyncHandler(homeController.aboutCompany));
router.get("/infrastructure", asyncHandler(homeController.infrastructure));
router.get("/career", asyncHandler(homeController.career));
router.get("/career/:slug", asyncHandler(homeController.careerOpening));
router.get("/terms-and-conditions", asyncHandler(homeController.termsAndConditions));
router.get("/privacy-policy", asyncHandler(homeController.privacyPolicy));
router.get("/thank-you", asyncHandler(homeController.thankYou));
router.get("/sitemap", asyncHandler(homeController.sitemap));
router.get("/sitemap.xml", asyncHandler(homeController.sitemapXml));
router.get("/robots.txt", homeController.robotsTxt);

module.exports = router;
