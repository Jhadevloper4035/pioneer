const BlogPost = require("../models/BlogPost");
const CareerOpening = require("../models/CareerOpening");
const GalleryItem = require("../models/GalleryItem");

function getList(Model, query = {}) {
  return Model.find({ active: true, ...query })
    .sort({ order: 1, title: 1 })
    .lean();
}

function stripGalleryType(items) {
  return items.map(({ type, ...item }) => item);
}

async function getBlogPosts() {
  return getList(BlogPost);
}

async function getCareerOpenings() {
  return getList(CareerOpening);
}

async function getGalleryItems() {
  return stripGalleryType(await getList(GalleryItem, { type: "gallery" }));
}

async function getInfrastructureGalleryItems() {
  return stripGalleryType(
    await getList(GalleryItem, { type: "infrastructure" })
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
