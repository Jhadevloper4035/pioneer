const { blogPosts } = require("../data/siteContent");

function blog(req, res) {
  res.render("blog/all-blog-page", { blogPosts });
}

function singleBlog(req, res) {
  const post = blogPosts.find((item) => item.slug === req.params.slug);

  if (!post) {
    return res.redirect(302, "/blog");
  }

  return res.render("blog/single-blog-page", {
    post,
    relatedPosts: blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3)
  });
}

module.exports = {
  blog,
  singleBlog
};
