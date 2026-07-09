const {
  buildSeoMeta,
  findSeoPageBySlug,
  normalizePageSlug
} = require("../services/seoService");

function shouldSkipSeo(req) {
  return req.path.startsWith("/api/")
    || req.path.startsWith("/admin")
    || req.path.startsWith("/assets/");
}




async function seoMiddleware(req, res, next) {
  if (shouldSkipSeo(req)) {
    return next();
  }

  const slug = normalizePageSlug(req.path);

  try {
    const seoRecord = await findSeoPageBySlug(slug);
    res.locals.seoPageSlug = slug;
    res.locals.seoRecord = seoRecord || null;
    res.locals.buildSeo = (fallback = {}) => buildSeoMeta(req, seoRecord || {}, fallback);
  } catch (error) {
    res.locals.seoPageSlug = slug;
    res.locals.seoRecord = null;
    res.locals.buildSeo = (fallback = {}) => buildSeoMeta(req, {}, fallback);
  }

  return next();
}

module.exports = seoMiddleware;
