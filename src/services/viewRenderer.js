function renderView(app, view, locals) {
  return new Promise((resolve, reject) => {
    app.render(view, locals, (error, html) => {
      if (error) return reject(error);
      return resolve(html);
    });
  });
}

function getValue(source, key, fallback = "") {
  return source && source[key] ? source[key] : fallback;
}

function getPublicLayoutOptions(view, locals) {
  const layoutByView = {
    "public/pages/index": { publicBodyClass: "home-page" },
    "public/pages/about/about-company": { publicWrapperClass: "page-wrapper about-company-page" },
    "public/pages/about/infrastructure": { publicWrapperClass: "my-app infrastructure-page" },
    "public/pages/career/all-career-page": { publicWrapperClass: "page-wrapper career-page" },
    "public/pages/career/single-career-page": { publicWrapperClass: "page-wrapper career-page career-opening-page" },
    "public/pages/e-catalogue": { publicWrapperClass: "page-wrapper catalogue-page", publicWrapperId: "catalogue-page" },
    "public/pages/error/404": { publicBodyClass: "error-page" },
    "public/pages/product/category/pvc-wpc-interior-louvers/single-product": { publicBodyClass: "single-product-page" }
  };

  const seoByView = {
    "public/pages/index": {
      title: "Pioneer Decor | Home Decor, Decorative Films, Louvers & WPC Products",
      description: "Pioneer Decor manufactures home decor and interior products including PVC decorative films, PVC/WPC interior louvers, WPC doors and frames, and PVC/WPC baffles.",
      keywords: ["home decor products", "decorative films", "interior louvers", "wpc doors", "wpc door frames", "pvc wpc baffles", "interior surfaces"],
      image: "/assets/images/banner/banner1.webp",
      canonicalPath: "/"
    },
    "public/pages/about/about-company": {
      title: "About Pioneer Decor | Home Decor & Interior Products",
      description: "Pioneer Decor manufactures PVC decorative films, PVC/WPC interior louvers, WPC doors and frames, and PVC/WPC baffles with a Make in India manufacturing focus.",
      image: "/assets/images/banner/about-us.avif",
      canonicalPath: "/about-company"
    },
    "public/pages/about/infrastructure": {
      title: "Pioneer Infrastructure | Rudrapur Manufacturing Plant",
      description: "Explore Pioneer Decor infrastructure at the Rudrapur manufacturing plant, including PVC film lines, extrusion lines, laminators, printing, wrapping, utilities, and packaging systems for interior products.",
      image: "/assets/images/infrastructure/banner.jpeg",
      canonicalPath: "/infrastructure"
    },
    "public/pages/blog/all-blog-page": {
      title: "Blog | Pioneer Decor",
      description: "Read Pioneer Decor notes on home decor materials, decorative films, interior louvers, WPC doors, frames, and baffles.",
      image: "/assets/images/banner/5.jpeg",
      canonicalPath: "/blog"
    },
    "public/pages/career/all-career-page": {
      title: "Career | Pioneer Decor",
      description: "Explore current openings at Pioneer Decor across sales, manufacturing, quality, and internship roles.",
      image: "/assets/images/infrastructure/banner.jpeg",
      canonicalPath: "/career"
    },
    "public/pages/contact-us": {
      title: "Contact Pioneer Decor | Product Enquiries",
      description: "Contact Pioneer Decor for PVC decorative films, PVC/WPC interior louvers, WPC doors and frames, PVC/WPC baffles, catalogues, samples, and product enquiries.",
      image: "/assets/images/banner/4.jpeg",
      canonicalPath: "/contact-us"
    },
    "public/pages/e-catalogue": {
      title: "E-Catalogue | Pioneer Decor",
      description: "Download Pioneer Decor product catalogues after sharing your contact information.",
      image: "/assets/images/banner/banner-cta.avif",
      canonicalPath: "/e-catalogue"
    },
    "public/pages/error/404": {
      title: "Page Not Found | Pioneer Decor",
      description: "The requested Pioneer Decor page could not be found.",
      image: "/assets/images/banner/5.jpeg",
      robots: "noindex, nofollow"
    },
    "public/pages/gallery": {
      title: "Gallery | Pioneer Decor",
      description: "Explore Pioneer Decor product applications across decorative films, interior louvers, WPC doors, frames, and baffles.",
      image: "/assets/images/banner/5.jpeg",
      canonicalPath: "/gallery"
    },
    "public/pages/pioneer-diagnostic": {
      title: "Pioneer Diagnostic",
      description: "Pioneer Decor diagnostic status page.",
      robots: "noindex, nofollow"
    }
  };

  const category = locals.category;
  const opening = locals.opening;
  const page = locals.page;
  const post = locals.post;
  const product = locals.product;
  const pageSeo = locals.pageSeo
    || (product && {
      title: `${getValue(product, "title")} | Pioneer Decor`,
      description: getValue(product, "summary", `${getValue(product, "title")} single product detail page with available shades, specifications, and application images.`),
      image: getValue(product, "mainImage"),
      canonicalPath: `/wpc-louvers/${getValue(product, "slug")}`
    })
    || (post && {
      title: `${post.title} | Blog | Pioneer Decor`,
      description: post.title,
      image: `/${post.image}`,
      canonicalPath: `/blog/${post.slug}`
    })
    || (opening && {
      title: `${opening.title} | Career | Pioneer Decor`,
      description: `View the ${opening.title} opening at Pioneer Decor and submit your application with resume.`,
      image: "/assets/images/infrastructure/banner.jpeg",
      canonicalPath: `/career/${opening.slug}`
    })
    || (category && {
      title: `${category.title} | Pioneer Decor`,
      description: category.text,
      image: category.image
    })
    || (page && {
      title: getValue(page, "title", "PVC/WPC Interior Louvers | Pioneer Decor"),
      description: getValue(page, "description", "Pioneer PVC/WPC Interior Louvers premium wall cladding profiles."),
      keywords: ["pvc wpc interior louvers", "wpc louvers", "pvc louvers", "decorative louvers", "pioneer flex"],
      image: "/assets/images/wpc-louvers/1.jpeg",
      canonicalPath: "/pvc-wpc-interior-louvers"
    })
    || (locals.pageTitle && {
      title: locals.pageTitle,
      description: locals.pageDescription,
      image: "/assets/images/banner/5.jpeg"
    })
    || seoByView[view];

  return {
    ...(layoutByView[view] || {}),
    pageSeo
  };
}

async function renderPublicPage(req, res, view, locals = {}) {
  const app = req.app;
  const viewLocals = { ...res.locals, ...locals };
  const body = await renderView(app, view, viewLocals);
  const html = await renderView(app, "public/layouts/main", {
    ...viewLocals,
    ...getPublicLayoutOptions(view, viewLocals),
    body
  });

  return res.send(html);
}

async function renderAdminPageWithLayout(req, res, view, locals = {}) {
  const app = req.app;
  const viewLocals = { ...res.locals, ...locals };
  const body = await renderView(app, view, viewLocals);
  const html = await renderView(app, "admin/layouts/main", {
    useAdminShell: true,
    ...viewLocals,
    body
  });

  return res.send(html);
}

module.exports = {
  renderAdminPageWithLayout,
  renderPublicPage
};
