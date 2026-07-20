const { getGalleryItems } = require("../services/contentService");
const { renderPublicPage } = require("../services/viewRenderer");

async function gallery(req, res) {
  const galleryItems = await getGalleryItems();
  return renderPublicPage(req, res, "public/pages/gallery", { galleryItems });
}

module.exports = {
  gallery
};
