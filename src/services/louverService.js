const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const LouverProduct = require("../models/LouverProduct");
const LouverShade = require("../models/LouverShade");

const publicDir = path.join(__dirname, "..", "..", "public");

const louverPage = {
  title: "PVC/WPC Interior Louvers | Pioneer Decor",
  description: "Pioneer PVC/WPC Interior Louvers premium wall cladding profiles."
};

function getValue(source, key, fallback = null) {
  return source && Object.prototype.hasOwnProperty.call(source, key)
    ? source[key]
    : fallback;
}

function publicAssetUrl(assetPath) {
  const cleanPath = String(assetPath || "");
  if (!cleanPath || cleanPath.startsWith("/") || /^[a-z]+:/i.test(cleanPath)) {
    return cleanPath;
  }

  return `/${cleanPath}`;
}

function assetToPublicPath(assetPath) {
  return String(assetPath || "").replace(/^\/?assets\//, "");
}

function louverThumb(assetPath) {
  const cleanPath = String(assetPath || "");
  const parsed = path.parse(assetToPublicPath(cleanPath));

  if (!parsed.dir || !parsed.name) return publicAssetUrl(cleanPath);

  const thumbAsset = path.posix.join(
    "assets",
    parsed.dir.replace(/\\/g, "/"),
    "thumbs",
    `${parsed.name}.jpg`
  );
  const thumbFile = path.join(publicDir, assetToPublicPath(thumbAsset));

  return fs.existsSync(thumbFile) ? publicAssetUrl(thumbAsset) : publicAssetUrl(cleanPath);
}

function normalizeProduct(product) {
  return {
    ...product,
    image: publicAssetUrl(product.image),
    mainImage: publicAssetUrl(product.mainImage || product.image),
    gallery: (product.gallery || [product.mainImage || product.image]).map(publicAssetUrl),
    applications: (product.applications || []).map((application) => ({
      ...application,
      image: publicAssetUrl(application.image)
    }))
  };
}

function normalizeShade(shade) {
  return {
    ...shade,
    image: publicAssetUrl(shade.image)
  };
}

async function getLouverProducts() {
  if (mongoose.connection.readyState !== 1) return [];

  const products = await LouverProduct.find({ active: true })
    .sort({ order: 1, productId: 1 })
    .lean();

  return products.map(normalizeProduct);
}

async function getLouverShades() {
  if (mongoose.connection.readyState !== 1) return [];

  const shades = await LouverShade.find({ active: true })
    .sort({ order: 1, name: 1 })
    .lean();

  return shades.map(normalizeShade);
}

async function getLouverProduct(slug) {
  if (mongoose.connection.readyState !== 1) return null;

  const product = await LouverProduct.findOne({ active: true, slug }).lean();
  return product ? normalizeProduct(product) : null;
}

module.exports = {
  getLouverProduct,
  getLouverProducts,
  getLouverShades,
  getValue,
  louverPage,
  louverThumb,
  publicAssetUrl
};
