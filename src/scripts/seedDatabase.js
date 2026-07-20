const mongoose = require("mongoose");
const connectDb = require("../config/db");
const { logger } = require("../config/logger");
const Catalogue = require("../models/Catalogue");
const BlogPost = require("../models/BlogPost");
const CareerOpening = require("../models/CareerOpening");
const DecorativeFilm = require("../models/DecorativeFilm");
const GalleryItem = require("../models/GalleryItem");
const LouverProduct = require("../models/LouverProduct");
const LouverShade = require("../models/LouverShade");
const blogPosts = require("../data/blogPosts.json");
const careerOpenings = require("../data/careerOpenings.json");
const catalogues = require("../data/catalogues.json");
const decorativeFilms = require("../data/decorativeFilms.json");
const galleryItems = require("../data/galleryItems.json");
const infrastructureGalleryItems = require("../data/infrastructureGalleryItems.json");
const louverProducts = require("../data/louverProductsSeed.json");
const louverShades = require("../data/louverShades.json");
const slugify = require("../utils/slugify");

function assetUrl(assetPath) {
  const cleanPath = String(assetPath || "");
  return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
}

const louverApplications = [
  { name: "Feature Walls", image: "/assets/images/wpc-louvers/1.jpeg" },
  { name: "TV Backdrops", image: "/assets/images/wpc-louvers/2.jpeg" },
  { name: "Ceilings", image: "/assets/images/wpc-louvers/3.jpeg" },
  { name: "Commercial Interiors", image: "/assets/images/wpc-louvers/4.jpeg" }
];

function louverProductDocument(product) {
  const slug = slugify(product.name);
  const specs = product.specifications || {};
  const mainImage = assetUrl(product.image);

  return {
    productId: product.id,
    name: product.name,
    slug,
    image: mainImage,
    mainImage,
    title: `PVC/WPC Interior Louvers ${product.name}`,
    sku: `WPC-${String(product.id).padStart(3, "0")}`,
    category: "PVC/WPC Interior Louvers",
    summary: "Premium PVC/WPC interior louver profile for decorative wall and ceiling applications with ready-to-install finish options.",
    gallery: [mainImage, ...louverApplications.map((application) => application.image)],
    applications: louverApplications,
    productInformation: [
      { label: "Width", value: `${specs.width_mm || "-"} mm` },
      { label: "Height", value: `${specs.height_mm || "-"} mm` },
      { label: "Length", value: `${specs.length_mm || "-"} mm` },
      { label: "No. of Flutes", value: String(specs.no_of_flutes || "-") },
      { label: "Approx. Weight", value: `${specs.approx_weight_per_panel_kg || "-"} kg per panel` }
    ],
    specifications: specs,
    active: true,
    order: product.id
  };
}

async function upsertList(Model, items, key, mapItem) {
  for (const [index, item] of items.entries()) {
    const doc = mapItem(item, index);
    await Model.findOneAndUpdate(
      { [key]: doc[key] },
      doc,
      { returnDocument: "after", upsert: true, runValidators: true }
    );
  }
}

async function seedDatabase() {
  await connectDb();

  await upsertList(LouverProduct, louverProducts, "productId", louverProductDocument);

  await upsertList(LouverShade, louverShades, "slug", (shade, index) => ({
    ...shade,
    slug: shade.slug || slugify(shade.name),
    active: true,
    order: index + 1
  }));

  await upsertList(DecorativeFilm, decorativeFilms, "slug", (film, index) => ({
    ...film,
    slug: film.slug || slugify(film.name),
    active: true,
    order: index + 1
  }));

  await upsertList(Catalogue, catalogues, "slug", (catalogue, index) => ({
    ...catalogue,
    slug: catalogue.slug || slugify(catalogue.title),
    active: true,
    order: index + 1
  }));

  await upsertList(BlogPost, blogPosts, "slug", (post, index) => ({
    ...post,
    slug: post.slug || slugify(post.title),
    active: true,
    order: index + 1
  }));

  await upsertList(CareerOpening, careerOpenings, "slug", (opening, index) => ({
    ...opening,
    slug: opening.slug || slugify(opening.title),
    active: true,
    order: index + 1
  }));

  await upsertList(GalleryItem, galleryItems, "image", (item, index) => ({
    ...item,
    type: "gallery",
    active: true,
    order: index + 1
  }));

  await upsertList(GalleryItem, infrastructureGalleryItems, "image", (item, index) => ({
    ...item,
    type: "infrastructure",
    active: true,
    order: index + 1
  }));

  logger.info({
    blogPosts: blogPosts.length,
    catalogues: catalogues.length,
    careerOpenings: careerOpenings.length,
    decorativeFilms: decorativeFilms.length,
    galleryItems: galleryItems.length,
    infrastructureGalleryItems: infrastructureGalleryItems.length,
    louverProducts: louverProducts.length,
    louverShades: louverShades.length
  }, "Seeded database");
}

seedDatabase()
  .catch((error) => {
    logger.error({ err: error }, "Failed to seed database");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
