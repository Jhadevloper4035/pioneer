const express = require("express");
const homeController = require("../controllers/homeController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(homeController.home));
router.get(["/home-grid", "/home-grid.html"], asyncHandler(homeController.homeGrid));
router.get(["/home-zigzag", "/home-zigzag.html"], asyncHandler(homeController.homeZigzag));
router.get(["/about-company", "/about-us", "/about.html"], asyncHandler(homeController.aboutCompany));
router.get(["/infrastructure", "/infrastructure.html"], asyncHandler(homeController.infrastructure));
router.get(["/career", "/careers", "/career.html"], asyncHandler(homeController.career));
router.get("/career/:slug", asyncHandler(homeController.careerOpening));
router.get(["/terms-and-conditions", "/terms", "/terms.html"], asyncHandler(homeController.termsAndConditions));
router.get(["/privacy-policy", "/privacy", "/privacy.html"], asyncHandler(homeController.privacyPolicy));
router.get(["/thank-you", "/thankyou", "/thank-you.html"], asyncHandler(homeController.thankYou));
router.get(["/sitemap", "/sitemap.html"], asyncHandler(homeController.sitemap));
router.get("/sitemap.xml", asyncHandler(homeController.sitemapXml));
router.get("/robots.txt", homeController.robotsTxt);
router.get(["/index", "/index.php"], homeController.indexRedirect);

module.exports = router;
