const {
  getBlogPosts,
  getCareerOpenings,
  getGalleryItems,
  getInfrastructureGalleryItems
} = require("../services/contentService");

const {
  generateRobotsTxt,
  generateSitemapXml,
  getSitemapSections
} = require("../services/sitemapService");
const { getSiteSetting } = require("../services/siteSettingService");
const { renderPublicPage } = require("../services/viewRenderer");

const emptyEnquiryFormOptions = {
  productCategories: [],
  quantities: [],
  units: [],
  applications: []
};

async function renderHome(req, res) {
  const [blogPosts, galleryItems, enquiryFormOptions] = await Promise.all([
    getBlogPosts(),
    getGalleryItems(),
    getSiteSetting("enquiryFormOptions", emptyEnquiryFormOptions)
  ]);

  return renderPublicPage(req, res, "public/pages/index", {
    blogPosts,
    enquiryFormOptions,
    galleryItems
  });
}

function home(req, res) {
  return renderHome(req, res);
}

function aboutCompany(req, res) {
  return renderPublicPage(req, res, "public/pages/about/about-company");
}

async function infrastructure(req, res) {
  const galleryItems = await getInfrastructureGalleryItems();
  return renderPublicPage(req, res, "public/pages/about/infrastructure", { galleryItems });
}

async function career(req, res) {
  const careerOpenings = await getCareerOpenings();
  return renderPublicPage(req, res, "public/pages/career/all-career-page", { careerOpenings });
}

async function careerOpening(req, res) {
  const careerOpenings = await getCareerOpenings();
  const opening = careerOpenings.find((item) => item.slug === req.params.slug);

  if (!opening) {
    return res.redirect(302, "/career");
  }

  return renderPublicPage(req, res, "public/pages/career/single-career-page", { opening, careerOpenings });
}

async function termsAndConditions(req, res) {
  const content = await getSiteSetting("publicPageContent");
  return renderPublicPage(req, res, "public/pages/legal-page", content.termsAndConditions);
}

async function privacyPolicy(req, res) {
  const content = await getSiteSetting("publicPageContent");
  return renderPublicPage(req, res, "public/pages/legal-page", content.privacyPolicy);
}

async function thankYou(req, res) {
  const content = await getSiteSetting("publicPageContent");
  return renderPublicPage(req, res, "public/pages/thank-you", content.thankYou);
}

async function sitemap(req, res) {
  const content = await getSiteSetting("publicPageContent");

  return renderPublicPage(req, res, "public/pages/sitemap", {
    ...content.sitemap,
    sitemapSections: await getSitemapSections()
  });
}

async function sitemapXml(req, res) {
  res.type("application/xml");
  return res.send(await generateSitemapXml(req));
}

function robotsTxt(req, res) {
  res.type("text/plain");
  return res.send(generateRobotsTxt(req));
}

module.exports = {
  aboutCompany,
  career,
  careerOpening,
  home,
  infrastructure,
  privacyPolicy,
  robotsTxt,
  sitemap,
  sitemapXml,
  thankYou,
  termsAndConditions
};
