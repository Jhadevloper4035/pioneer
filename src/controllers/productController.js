const mongoose = require("mongoose");
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
  category: "WPC Louvers",
  mainImage: "assets/images/products/product-1.png",
  gallery: ["assets/images/products/product-1.png"],
  availableShades: [],
  applications: [],
  productInformation: []
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

  res.render("wpc-louvers", {
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
    return res.status(404).render("wpc-louvers-single-product", {
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

  return res.render("wpc-louvers-single-product", {
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

module.exports = {
  listLouvers,
  showLouver
};
