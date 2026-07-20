const mongoose = require("mongoose");
const decorativeFilmsSeed = require("../data/decorativeFilms.json");
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
const DecorativeFilm = require("../models/DecorativeFilm");

const categoryPages = {
  "pvc-decorative-films": {
    title: "PVC Decorative Films",
    tag: "(PVC Decorative Films)",
    text: "Decorative PVC films for furniture, doors, wall panels, modular interiors, and profile wrapping applications.",
    image: "/assets/images/category/pvc-decor-frame.webp",
    anchor: "category-heading"
  },
  "wpc-doors": {
    title: "WPC Doors",
    tag: "(WPC Doors)",
    text: "Durable WPC doors developed for moisture-resistant, termite-resistant interior fitment.",
    image: "/assets/images/projects/wpc-doors.jpeg",
    anchor: "wpc-doors-title"
  },
  "wpc-door-frames": {
    title: "WPC Door Frames",
    tag: "(WPC Door Frames)",
    text: "Stable WPC door frames for moisture-resistant, termite-resistant interior fitment.",
    image: "/assets/images/projects/wpc-door-frame.jpeg",
    anchor: "wpc-frames-title"
  },
  "pvc-wpc-baffles": {
    title: "PVC/WPC Baffles",
    tag: "(PVC/WPC Baffles)",
    text: "Linear baffle systems for ceiling, partition, screen, facade, and decorative interior applications.",
    image: "/assets/images/category/baffles.jpeg",
    anchor: "category-heading"
  }
};

async function getDecorativeFilms() {
  if (mongoose.connection.readyState !== 1) {
    return decorativeFilmsSeed;
  }

  const films = await DecorativeFilm.find({ active: true })
    .sort({ order: 1, name: 1 })
    .lean();

  return films.length ? films : decorativeFilmsSeed;
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
    throw new AppError("Louver product not found", 404);
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
    const category = categoryPages[categoryKey];

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
  listWpcDoorsAndFrames: (req, res) => res.redirect(301, "/wpc-doors"),
  listPvcWpcBaffles: showCategory("pvc-wpc-baffles"),
  showLouver
};
