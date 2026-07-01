const { blogPosts } = require("../data/siteContent");

function blog(req, res) {
  res.render("blog", { blogPosts });
}

module.exports = {
  blog
};
