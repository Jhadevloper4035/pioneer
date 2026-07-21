const { renderPublicPage } = require("../services/viewRenderer");
const AppError = require("../utils/AppError");

const {
  getLouverProduct,
  getLouverProducts,
  getLouverShades,
  getValue,
  louverPage,
  louverThumb
} = require("../services/louverService");
const { getSiteSetting } = require("../services/siteSettingService");
const DecorativeFilm = require("../models/DecorativeFilm");

async function getDecorativeFilms() {
  return DecorativeFilm.find({ active: true })
    .sort({ order: 1, name: 1 })
    .lean();
}

function normalizeCategoryHero(category) {
  return {
    ...category,
    tag: category.tag || category.tagline || "",
    title: category.title || category.name || "",
    text: category.text || category.description || "",
    anchor: category.anchor || "category-heading"
  };
}

function requireCategoryHero(category, categoryKey) {
  if (!category.tag || !category.title || !category.text) {
    throw new AppError(`Missing product category page setting: ${categoryKey}`, 500);
  }
}

async function listLouvers(req, res) {
  const products = await getLouverProducts();

  return renderPublicPage(req, res, "public/pages/product/category/pvc-wpc-interior-louvers/all-product", {
    page: louverPage,
    products,
    getValue,
    louverThumb
  });
}

async function showLouver(req, res) {
  const slug = req.params.product || req.query.product || "wpc-louvers";
  const product = await getLouverProduct(slug);

  if (!product) {
    const messages = await getSiteSetting("responseMessages");
    throw new AppError(messages.product.louverNotFound, 404);
  }

  const gallery = getValue(product, "gallery", [getValue(product, "mainImage", "")]);
  const shades = await getLouverShades();

  return renderPublicPage(req, res, "public/pages/product/category/pvc-wpc-interior-louvers/single-product", {
    product,
    gallery,
    shades,
    productInfo: getValue(product, "productInformation", []),
    defaultShade: getValue(getValue(shades, 0, {}), "name", ""),
    mainImage: getValue(gallery, 0, getValue(product, "mainImage", "")),
    getValue,
    louverThumb
  });
}

function showCategory(categoryKey) {
  return async (req, res) => {
    const categoryPages = await getSiteSetting("productCategoryPages");
    const category = normalizeCategoryHero(categoryPages[categoryKey] || {});
    requireCategoryHero(category, categoryKey);

    return renderPublicPage(req, res, `public/pages/product/category/${categoryKey}/all-product`, {
      category,
      decorativeFilms: categoryKey === "pvc-decorative-films" ? await getDecorativeFilms() : [],
      getValue
    });
  };
}

module.exports = {
  listDecorativeFilms: showCategory("pvc-decorative-films"),
  listLouvers,
  listWpcDoors: showCategory("wpc-doors"),
  listWpcDoorFrames: showCategory("wpc-door-frames"),
  listPvcWpcBaffles: showCategory("pvc-wpc-baffles"),
  showLouver
};
