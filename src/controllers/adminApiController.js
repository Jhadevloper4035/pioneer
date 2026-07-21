const { sanitizeUser } = require("../services/authService");
const {
  deleteSeoPage,
  getSeoPage,
  listSeoPages,
  normalizePageSlug,
  upsertSeoPage
} = require("../services/seoService");
const { getSiteSetting } = require("../services/siteSettingService");
const { listUsers } = require("../services/userRepository");

async function users(req, res) {
  const users = (await listUsers()).map(sanitizeUser);

  res.status(200).json({
    success: true,
    data: {
      total: users.length,
      users
    }
  });
}

async function seoPages(req, res) {
  const pages = await listSeoPages();

  res.status(200).json({
    success: true,
    data: {
      total: pages.length,
      pages
    }
  });
}

async function seoPage(req, res) {
  const slug = normalizePageSlug(req.query.slug);
  const page = await getSeoPage(slug);

  res.status(200).json({
    success: true,
    data: {
      slug,
      page
    }
  });
}

async function saveSeoPage(req, res) {
  const messages = await getSiteSetting("responseMessages");
  const slug = normalizePageSlug(req.body.slug || req.query.slug);
  const page = await upsertSeoPage(slug, req.body);

  res.status(200).json({
    success: true,
    message: messages.adminApi.seoPageSaved,
    data: {
      page
    }
  });
}

async function removeSeoPage(req, res) {
  const messages = await getSiteSetting("responseMessages");
  const slug = normalizePageSlug(req.query.slug);
  const page = await deleteSeoPage(slug);

  res.status(200).json({
    success: true,
    message: messages.adminApi.seoPageDeleted,
    data: {
      page
    }
  });
}

module.exports = {
  removeSeoPage,
  saveSeoPage,
  seoPage,
  seoPages,
  users
};
