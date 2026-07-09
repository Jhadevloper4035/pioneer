const { blogPosts } = require("../data/siteContent");
const { renderPublicPage } = require("../services/viewRenderer");

function blog(req, res) {
  return renderPublicPage(req, res, "public/pages/blog/all-blog-page", { blogPosts });
}

function singleBlog(req, res) {
  const post = blogPosts.find((item) => item.slug === req.params.slug);

  if (!post) {
    return res.redirect(302, "/blog");
  }

  return renderPublicPage(req, res, "public/pages/blog/single-blog-page", {
    post,
    relatedPosts: blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3)
  });
}

module.exports = {
  blog,
  singleBlog
};
