const mongoose = require("mongoose");
const { decorativeFilms } = require("../data/decorativeFilms");
const { renderPublicPage } = require("../services/viewRenderer");
const {
  getLouverData,
  getLouverProduct,
  getValue,
  louverThumb
} = require("../data/wpcLouvers");
const LouverProduct = require("../models/LouverProduct");

const fallbackProduct = {
  slug: "not-found",
  name: "Product Not Found",
  title: "Product Not Found",
  sku: "-",
  category: "PVC/WPC Interior Louvers",
  mainImage: "assets/images/products/product-1.png",
  gallery: ["assets/images/products/product-1.png"],
  availableShades: [],
  applications: [],
  productInformation: []
};

const categoryPages = {
  "pvc-decorative-films": {
    title: "PVC Decorative Films",
    tag: "(PVC Decorative Films)",
    text: "Decorative PVC films for furniture, doors, wall panels, modular interiors, and profile wrapping applications.",
    image: "/assets/images/category/pvc-decor-frame.webp",
    anchor: "category-heading"
  },
  "wpc-doors-and-frames": {
    title: "WPC Doors and Frames",
    tag: "(WPC Doors and Frames)",
    text: "Durable WPC doors and frames developed for moisture-resistant, termite-resistant interior fitment.",
    image: "/assets/images/category/pvc-door-frame.jpeg",
    anchor: "category-heading"
  },
  "pvc-wpc-baffles": {
    title: "PVC/WPC Baffles",
    tag: "(PVC/WPC Baffles)",
    text: "Linear baffle systems for ceiling, partition, screen, facade, and decorative interior applications.",
    image: "/assets/images/category/baffles.jpeg",
    anchor: "category-heading"
  }
};

async function getProducts() {
  if (mongoose.connection.readyState !== 1) {
    return null;
  }

  const products = await LouverProduct.find({ active: true })
    .sort({ order: 1, productId: 1 })
    .lean();

  return products.length ? products : null;
}

async function listLouvers(req, res) {
  const data = getLouverData(await getProducts());

  return renderPublicPage(req, res, "public/pages/product/category/pvc-wpc-interior-louvers/all-product", {
    page: data.page,
    products: data.products,
    getValue,
    louverThumb
  });
}

async function showLouver(req, res) {
  const slug = req.params.product || req.query.product || "wpc-louvers";
  const product = getLouverProduct(slug, await getProducts());

  if (!product) {
    res.status(404);
    return renderPublicPage(req, res, "public/pages/product/category/pvc-wpc-interior-louvers/single-product", {
      product: fallbackProduct,
      gallery: fallbackProduct.gallery,
      shades: [],
      productInfo: [],
      defaultShade: "",
      mainImage: fallbackProduct.mainImage,
      getValue,
      louverThumb
    });
  }

  const gallery = getValue(product, "gallery", [getValue(product, "mainImage", "")]);
  const shades = getValue(product, "availableShades", []);

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
  return (req, res) => {
    const category = categoryPages[categoryKey];

    return renderPublicPage(req, res, `public/pages/product/category/${categoryKey}/all-product`, {
      category,
      decorativeFilms: categoryKey === "pvc-decorative-films" ? decorativeFilms : [],
      getValue
    });
  };
}

module.exports = {
  listDecorativeFilms: showCategory("pvc-decorative-films"),
  listLouvers,
  listWpcDoorsAndFrames: showCategory("wpc-doors-and-frames"),
  listPvcWpcBaffles: showCategory("pvc-wpc-baffles"),
  showLouver
};
