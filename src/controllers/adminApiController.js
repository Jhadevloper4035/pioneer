const { sanitizeUser } = require("../services/authService");
const CareerOpening = require("../models/CareerOpening");
const AppError = require("../utils/AppError");
const slugify = require("../utils/slugify");
const {
  deleteSeoPage,
  getSeoPage,
  listSeoPages,
  normalizePageSlug,
  upsertSeoPage
} = require("../services/seoService");
const { getSiteSetting } = require("../services/siteSettingService");
const { listUsers } = require("../services/userRepository");

function listItems(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function jobPostValues(body) {
  return {
    title: body.title,
    department: body.department,
    location: body.location,
    type: body.type,
    experience: body.experience,
    summary: body.summary,
    responsibilities: listItems(body.responsibilities),
    requirements: listItems(body.requirements),
    active: body.active !== false,
    order: body.order || 0
  };
}

async function uniqueJobSlug(title, id) {
  const slug = slugify(title, "job");
  const duplicate = await CareerOpening.exists(id ? { slug, _id: { $ne: id } } : { slug });

  if (duplicate) {
    throw new AppError("A job post with this title already exists", 409);
  }

  return slug;
}

async function createJobPost(req, res) {
  const jobPost = await CareerOpening.create({
    ...jobPostValues(req.body),
    slug: await uniqueJobSlug(req.body.title)
  });

  res.status(201).json({
    success: true,
    message: "Job post created",
    data: { jobPost }
  });
}

async function updateJobPost(req, res) {
  const jobPost = await CareerOpening.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...jobPostValues(req.body),
        slug: await uniqueJobSlug(req.body.title, req.params.id)
      }
    },
    { new: true, runValidators: true }
  ).lean();

  if (!jobPost) {
    throw new AppError("Job post not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Job post updated",
    data: { jobPost }
  });
}

async function deleteJobPost(req, res) {
  const jobPost = await CareerOpening.findByIdAndDelete(req.params.id).lean();

  if (!jobPost) {
    throw new AppError("Job post not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Job post deleted"
  });
}

async function jobPosts(req, res) {
  const jobPosts = await CareerOpening.find().sort({ createdAt: -1 }).lean();

  res.status(200).json({
    success: true,
    data: { jobPosts }
  });
}

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
  createJobPost,
  deleteJobPost,
  jobPosts,
  removeSeoPage,
  saveSeoPage,
  seoPage,
  seoPages,
  updateJobPost,
  users
};
