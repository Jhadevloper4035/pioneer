const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.get(["/blog", "/blog-default"], blogController.blog);

module.exports = router;
