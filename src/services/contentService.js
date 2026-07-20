const mongoose = require("mongoose");
const BlogPost = require("../models/BlogPost");
const CareerOpening = require("../models/CareerOpening");
const GalleryItem = require("../models/GalleryItem");
const blogPostsSeed = require("../data/blogPosts.json");
const careerOpeningsSeed = require("../data/careerOpenings.json");
const galleryItemsSeed = require("../data/galleryItems.json");
const infrastructureGalleryItemsSeed = require("../data/infrastructureGalleryItems.json");

async function getList(Model, seed, query = {}) {
  if (mongoose.connection.readyState !== 1) return seed;

  const items = await Model.find({ active: true, ...query })
    .sort({ order: 1, title: 1 })
    .lean();

  return items.length ? items : seed;
}

function stripGalleryType(items) {
  return items.map(({ type, ...item }) => item);
}

async function getBlogPosts() {
  return getList(BlogPost, blogPostsSeed);
}

async function getCareerOpenings() {
  return getList(CareerOpening, careerOpeningsSeed);
}

async function getGalleryItems() {
  return stripGalleryType(await getList(GalleryItem, galleryItemsSeed, { type: "gallery" }));
}

async function getInfrastructureGalleryItems() {
  return stripGalleryType(
    await getList(GalleryItem, infrastructureGalleryItemsSeed, { type: "infrastructure" })
  );
}

async function getSiteContent() {
  const [
    blogPosts,
    careerOpenings,
    galleryItems,
    infrastructureGalleryItems
  ] = await Promise.all([
    getBlogPosts(),
    getCareerOpenings(),
    getGalleryItems(),
    getInfrastructureGalleryItems()
  ]);

  return {
    blogPosts,
    careerOpenings,
    galleryItems,
    infrastructureGalleryItems
  };
}

module.exports = {
  getBlogPosts,
  getCareerOpenings,
  getGalleryItems,
  getInfrastructureGalleryItems,
  getSiteContent
};
