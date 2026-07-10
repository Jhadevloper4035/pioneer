const express = require("express");
const adminApiRoutes = require("./adminApiRoutes");
const adminRoutes = require("./adminRoutes");
const authRoutes = require("./authRoutes");
const blogRoutes = require("./blogRoutes");
const catalogueRoutes = require("./catalogueRoutes");
const enquiryRoutes = require("./enquiryRoutes");
const galleryRoutes = require("./galleryRoutes");
const homeRoutes = require("./homeRoutes");
const productRoutes = require("./productRoutes");
const systemRoutes = require("./systemRoutes");

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/api/admin", adminApiRoutes);
router.use("/api/auth", authRoutes);
router.use(homeRoutes);
router.use(enquiryRoutes);
router.use(galleryRoutes);
router.use(blogRoutes);
router.use(catalogueRoutes);
router.use(productRoutes);
router.use(systemRoutes);

module.exports = router;
