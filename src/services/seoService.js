const mongoose = require("mongoose");
const env = require("../config/env");
const SeoPage = require("../models/SeoPage");

function normalizePageSlug(value = "/") {
  let raw = String(value || "/").trim();

  try {
    raw = new URL(raw, "http://localhost").pathname;
  } catch (error) {
    raw = raw.split("?")[0].split("#")[0];
  }

  const normalized = raw
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "")
    .toLowerCase();

  return normalized || "home";
}

function normalizeKeywords(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function getRequestOrigin(req) {
  if (env.siteUrl) return env.siteUrl;

  const protocol = req.get("x-forwarded-proto") || req.protocol || "http";
  const host = req.get("host") || `${env.host}:${env.port}`;
  return `${protocol}://${host}`.replace(/\/+$/, "");
}

function absoluteUrl(req, value) {
  if (!value) return "";

  const raw = String(value).trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  const origin = getRequestOrigin(req);
  return `${origin}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

function normalizeSchema(schemaJson) {
  if (!schemaJson) return [];
  return Array.isArray(schemaJson) ? schemaJson.filter(Boolean) : [schemaJson];
}

function buildSeoMeta(req, seoRecord = {}, fallback = {}) {
  const fallbackTitle = fallback.title || fallback.pageTitle || env.appName;
  const fallbackDescription = fallback.description || fallback.metaDescription || "";
  const canonicalPath = seoRecord.canonicalPath || fallback.canonicalPath || req.path || "/";
  const title = seoRecord.metaTitle || seoRecord.pageTitle || fallbackTitle;
  const description = seoRecord.metaDescription || fallbackDescription;
  const keywords = normalizeKeywords(seoRecord.keywords?.length ? seoRecord.keywords : fallback.keywords);
  const robots = seoRecord.noindex || seoRecord.nofollow
    ? `${seoRecord.noindex ? "noindex" : "index"}, ${seoRecord.nofollow ? "nofollow" : "follow"}`
    : (seoRecord.robots || fallback.robots || "index, follow");
  const image = seoRecord.ogImage || seoRecord.twitterImage || fallback.image || fallback.ogImage || "";
  const canonicalUrl = absoluteUrl(req, seoRecord.canonicalUrl || fallback.canonicalUrl || canonicalPath);
  const ogImage = absoluteUrl(req, image);
  const schema = normalizeSchema(seoRecord.schemaJson || fallback.schemaJson);

  if (!schema.length) {
    schema.push({
      "@context": "https://schema.org",
      "@type": fallback.schemaType || "WebPage",
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: {
        "@type": "WebSite",
        name: env.appName,
        url: getRequestOrigin(req)
      }
    });
  }

  return {
    slug: seoRecord.slug || normalizePageSlug(req.path),
    title,
    description,
    keywords,
    canonicalUrl,
    robots,
    og: {
      title: seoRecord.ogTitle || title,
      description: seoRecord.ogDescription || description,
      image: ogImage,
      type: seoRecord.ogType || fallback.ogType || "website",
      url: canonicalUrl
    },
    twitter: {
      card: seoRecord.twitterCard || fallback.twitterCard || "summary_large_image",
      title: seoRecord.twitterTitle || seoRecord.ogTitle || title,
      description: seoRecord.twitterDescription || seoRecord.ogDescription || description,
      image: absoluteUrl(req, seoRecord.twitterImage || image)
    },
    schema
  };
}

async function findSeoPageBySlug(slug) {
  if (mongoose.connection.readyState !== 1) return null;
  return SeoPage.findOne({ slug: normalizePageSlug(slug), active: true }).lean();
}

async function listSeoPages() {
  return SeoPage.find().sort({ slug: 1 }).lean();
}

async function getSeoPage(slug) {
  return SeoPage.findOne({ slug: normalizePageSlug(slug) }).lean();
}

async function upsertSeoPage(slug, payload) {
  const normalizedSlug = normalizePageSlug(slug || payload.slug);
  const keywords = normalizeKeywords(payload.keywords);

  return SeoPage.findOneAndUpdate(
    { slug: normalizedSlug },
    {
      ...payload,
      slug: normalizedSlug,
      keywords
    },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true
    }
  ).lean();
}

async function deleteSeoPage(slug) {
  return SeoPage.findOneAndDelete({ slug: normalizePageSlug(slug) }).lean();
}

module.exports = {
  buildSeoMeta,
  findSeoPageBySlug,
  getSeoPage,
  listSeoPages,
  normalizePageSlug,
  upsertSeoPage,
  deleteSeoPage
};
