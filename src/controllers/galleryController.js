const { galleryItems } = require("../data/siteContent");
const { renderPublicPage } = require("../services/viewRenderer");

function gallery(req, res) {
  return renderPublicPage(req, res, "public/pages/gallery", { galleryItems });
}

module.exports = {
  gallery
};
