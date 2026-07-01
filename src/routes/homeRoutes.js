const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.home);
router.get(["/home-grid", "/home-grid.html"], homeController.homeGrid);
router.get(["/home-zigzag", "/home-zigzag.html"], homeController.homeZigzag);
router.get(["/about-company", "/about-us", "/about.html"], homeController.aboutCompany);
router.get(["/infrastructure", "/infrastructure.html"], homeController.infrastructure);
router.get(["/index", "/index.php"], homeController.indexRedirect);

module.exports = router;
