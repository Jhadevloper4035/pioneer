const fs = require("fs");
const path = require("path");
const louverData = require("../data/louvers.json");

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

function publicAssetExists(assetPath) {
  const cleanPath = publicAssetUrl(assetPath);
  if (!cleanPath || /^[a-z]+:/i.test(cleanPath)) return Boolean(cleanPath);

  return fs.existsSync(path.join(publicDir, assetToPublicPath(cleanPath).replace(/^\/+/, "")));
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

function getJsonVariants(product) {
  return getValue(product, "variants", [])
    .map(normalizeShade)
    .filter((variant) => publicAssetExists(variant.image));
}

function getJsonFinishVariants(product) {
  return getValue(product, "variants", [])
    .slice(1)
    .map(normalizeShade)
    .filter((variant) => publicAssetExists(variant.image));
}

function parseMmSize(product) {
  const match = String(product.name || product.slug || "").match(/\b(\d+)\s*mm\b/i);
  return match ? Number(match[1]) : "-";
}

function jsonProduct(product, index) {
  const variants = getJsonVariants(product);
  const gallery = variants.length ? variants.map((variant) => variant.image) : [product.image].filter(Boolean);
  const specifications = getValue(product, "specifications", {});

  return normalizeProduct({
    productId: getValue(product, "productId", 9000 + index),
    name: product.name,
    slug: product.slug,
    image: product.image || gallery[0],
    mainImage: product.mainImage || product.image || gallery[0],
    title: getValue(product, "title", `${product.name} PVC/WPC Interior Louvers`),
    sku: getValue(product, "sku", `PIONEER-${String(product.slug).toUpperCase()}-LOUVER`),
    category: getValue(product, "category", "PVC/WPC Interior Louvers"),
    summary: getValue(product, "summary", `Explore ${product.name} PVC/WPC interior louver finishes from Pioneer Decor.`),
    gallery,
    productInformation: getValue(product, "productInformation", [
      { label: "Profile", value: product.name },
      { label: "Available finishes", value: String(variants.length) }
    ]),
    specifications: {
      width_mm: getValue(specifications, "width_mm", parseMmSize(product)),
      height_mm: getValue(specifications, "height_mm", "-"),
      length_mm: getValue(specifications, "length_mm", "-"),
      no_of_flutes: getValue(specifications, "no_of_flutes", "-")
    },
    order: getValue(product, "order", index),
    hasVariants: variants.length > 1,
    variants
  });
}

async function getLouverProducts() {
  return louverData.products.map(jsonProduct);
}

async function getLouverShades(productOrSlug) {
  const slug = typeof productOrSlug === "string" ? productOrSlug : productOrSlug && productOrSlug.slug;
  const product = louverData.products.find((item) => item.slug === slug);
  return product ? getJsonFinishVariants(product) : [];
}

async function getLouverProduct(slug) {
  const product = louverData.products.find((item) => item.slug === slug);
  return product ? jsonProduct(product, louverData.products.indexOf(product)) : null;
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
