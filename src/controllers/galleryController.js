const { galleryItems } = require("../data/siteContent");

function gallery(req, res) {
  res.render("gallery", { galleryItems });
}

module.exports = {
  gallery
};
