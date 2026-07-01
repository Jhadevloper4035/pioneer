const {
  blogPosts,
  galleryItems,
  infrastructureGalleryItems
} = require("../data/siteContent");

function renderHome(res, variantOptions = {}) {
  res.render("index", {
    blogPosts,
    galleryItems,
    ...variantOptions
  });
}

function home(req, res) {
  renderHome(res, {
    homeVariant: "grid",
    showCategoryGrid: true,
    showDecorativeZigzag: false
  });
}

function homeGrid(req, res) {
  renderHome(res, {
    homeVariant: "grid",
    showCategoryGrid: true,
    showDecorativeZigzag: false
  });
}

function homeZigzag(req, res) {
  renderHome(res, {
    homeVariant: "zigzag",
    showCategoryGrid: false,
    showDecorativeZigzag: true
  });
}

function aboutCompany(req, res) {
  res.render("about-company");
}

function infrastructure(req, res) {
  res.render("infrastructure", { galleryItems: infrastructureGalleryItems });
}

function indexRedirect(req, res) {
  res.redirect(301, "/");
}

module.exports = {
  aboutCompany,
  home,
  homeGrid,
  homeZigzag,
  infrastructure,
  indexRedirect
};
