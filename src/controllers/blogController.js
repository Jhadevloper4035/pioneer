const { getBlogPosts } = require("../services/contentService");
const { renderPublicPage } = require("../services/viewRenderer");

async function blog(req, res) {
  const blogPosts = await getBlogPosts();
  return renderPublicPage(req, res, "public/pages/blog/all-blog-page", { blogPosts });
}

async function singleBlog(req, res) {
  const blogPosts = await getBlogPosts();
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
