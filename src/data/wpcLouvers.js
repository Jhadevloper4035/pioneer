const fs = require("fs");
const path = require("path");
const louverProductsSeed = require("./louverProductsSeed");
const slugify = require("../utils/slugify");

const publicDir = path.join(__dirname, "..", "..", "public");
const customDataPath = path.join(__dirname, "wpc-louvers.json");

const shadeLibrary = [
  ["Andhra Teak", "andhra-teak.jpg"],
  ["Bleached Walnut", "bleached-wallnut.jpg"],
  ["Blond Wood", "blond-wood.jpg"],
  ["Golden Teak", "golden-teak.jpg"],
  ["Oak Wood", "oak-wood.jpg"],
  ["Rose Wood", "rose-wood.jpg"],
  ["Wenge Brown", "wenge-brown.jpg"],
  ["White Satuario Marble", "white-satuario-marble.jpg"],
  ["Green Marble", "green-marble.jpg"],
  ["Light Grey", "lt-grey.jpg"],
  ["Dark Grey Marble", "dark-grey-marble.jpg"]
].map(([name, file]) => ({
  name,
  image: `assets/images/shades/${file}`
}));

const applicationLibrary = [
  {
    name: "Feature Walls",
    image: "assets/images/wpc-louvers/1.jpeg"
  },
  {
    name: "TV Backdrops",
    image: "assets/images/wpc-louvers/2.jpeg"
  },
  {
    name: "Ceilings",
    image: "assets/images/wpc-louvers/3.jpeg"
  },
  {
    name: "Commercial Interiors",
    image: "assets/images/wpc-louvers/4.jpeg"
  }
];

const fallbackProducts = louverProductsSeed.map((product) => ({
  ...product,
  productId: product.id,
  slug: slugify(product.name),
  title: product.name,
  sku: `WPC-${String(product.id).padStart(3, "0")}`,
  category: "WPC Louvers",
  mainImage: product.image,
  summary:
    "Premium WPC louver profile for decorative wall and ceiling applications with ready-to-install finish options."
}));

function getValue(source, key, fallback = null) {
  return source && Object.prototype.hasOwnProperty.call(source, key)
    ? source[key]
    : fallback;
}

function assetToPublicPath(assetPath) {
  return String(assetPath || "").replace(/^assets\//, "");
}

function louverThumb(assetPath) {
  const cleanPath = String(assetPath || "");
  const parsed = path.parse(assetToPublicPath(cleanPath));

  if (!parsed.dir || !parsed.name) return cleanPath;

  const thumbAsset = path.posix.join(
    "assets",
    parsed.dir.replace(/\\/g, "/"),
    "thumbs",
    `${parsed.name}.jpg`
  );
  const thumbFile = path.join(publicDir, assetToPublicPath(thumbAsset));

  return fs.existsSync(thumbFile) ? thumbAsset : cleanPath;
}

function readCustomData() {
  if (!fs.existsSync(customDataPath)) return null;

  try {
    const parsed = JSON.parse(fs.readFileSync(customDataPath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    console.warn(`Unable to read ${customDataPath}: ${error.message}`);
    return null;
  }
}

function normalizeProduct(product, index, data) {
  const specs = getValue(product, "specifications", {});
  const fallbackName = `WPC Louver ${getValue(specs, "width_mm", index + 1)} x ${getValue(specs, "height_mm", "-")} mm`;
  const name = getValue(product, "name", fallbackName);
  const slug = getValue(product, "slug", slugify(name));
  const mainImage = getValue(product, "mainImage", getValue(product, "image", ""));
  const applications = getValue(product, "applications", data.applicationLibrary);
  const gallery = getValue(
    product,
    "gallery",
    [mainImage, ...applications.map((application) => application.image)].filter(Boolean)
  );

  return {
    ...product,
    name,
    slug,
    sku: getValue(product, "sku", `WPC-${slug.replace(/-/g, "").toUpperCase()}`),
    title: getValue(product, "title", `WPC Louvers ${name}`),
    category: getValue(product, "category", "WPC Louvers"),
    image: getValue(product, "image", mainImage),
    mainImage,
    availableShades: getValue(product, "availableShades", data.shadeLibrary),
    applications,
    gallery,
    productInformation: getValue(product, "productInformation", [
      { label: "Width", value: `${getValue(specs, "width_mm", "-")} mm` },
      { label: "Height", value: `${getValue(specs, "height_mm", "-")} mm` },
      { label: "Length", value: `${getValue(specs, "length_mm", "-")} mm` },
      { label: "No. of Flutes", value: getValue(specs, "no_of_flutes", "-") },
      {
        label: "Approx. Weight",
        value: `${getValue(specs, "approx_weight_per_panel_kg", "-")} kg per panel`
      },
      {
        label: "Price",
        value: `${getValue(specs, "price_per_panel_inr", "-")} INR per panel`
      }
    ])
  };
}

function getLouverData(products) {
  const customData = readCustomData() || {};
  const data = {
    page: getValue(customData, "page", {
      title: "WPC/PVC Louvers | Pioneer Flex",
      description: "Pioneer WPC/PVC Louvers premium wall cladding profiles."
    }),
    shadeLibrary: getValue(customData, "shadeLibrary", shadeLibrary),
    applicationLibrary: getValue(customData, "applicationLibrary", applicationLibrary),
    products: products || getValue(customData, "products", fallbackProducts)
  };

  data.products = data.products.map((product, index) =>
    normalizeProduct(product, index, data)
  );

  return data;
}

function getLouverProduct(slug, products) {
  const data = getLouverData(products);
  return (
    data.products.find((product) => product.slug === slug) ||
    data.products[0] ||
    null
  );
}

module.exports = {
  getLouverData,
  getLouverProduct,
  getValue,
  louverThumb
};
