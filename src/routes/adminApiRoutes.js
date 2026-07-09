const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeUser } = require("../services/authService");
const { listUsers } = require("../services/userRepository");
const {
  deleteSeoPage,
  getSeoPage,
  listSeoPages,
  normalizePageSlug,
  upsertSeoPage
} = require("../services/seoService");

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = (await listUsers()).map(sanitizeUser);

    res.status(200).json({
      success: true,
      data: {
        total: users.length,
        users
      }
    });
  })
);

router.get(
  "/seo",
  asyncHandler(async (req, res) => {
    const pages = await listSeoPages();

    res.status(200).json({
      success: true,
      data: {
        total: pages.length,
        pages
      }
    });
  })
);

router.get(
  "/seo/page",
  asyncHandler(async (req, res) => {
    const slug = normalizePageSlug(req.query.slug);
    const page = await getSeoPage(slug);

    res.status(200).json({
      success: true,
      data: {
        slug,
        page
      }
    });
  })
);

router.put(
  "/seo/page",
  asyncHandler(async (req, res) => {
    const slug = normalizePageSlug(req.body.slug || req.query.slug);
    const page = await upsertSeoPage(slug, req.body);

    res.status(200).json({
      success: true,
      message: "SEO page saved",
      data: {
        page
      }
    });
  })
);

router.delete(
  "/seo/page",
  asyncHandler(async (req, res) => {
    const slug = normalizePageSlug(req.query.slug);
    const page = await deleteSeoPage(slug);

    res.status(200).json({
      success: true,
      message: "SEO page deleted",
      data: {
        page
      }
    });
  })
);

module.exports = router;
