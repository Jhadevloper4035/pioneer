const express = require("express");
const blogController = require("../controllers/blogController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/blog", asyncHandler(blogController.blog));
router.get("/blog/:slug", asyncHandler(blogController.singleBlog));

module.exports = router;
