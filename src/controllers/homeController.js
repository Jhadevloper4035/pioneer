const enquiryFormOptions = require("../data/enquiryFormOptions.json");
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
const { renderPublicPage } = require("../services/viewRenderer");

async function renderHome(req, res, variantOptions = {}) {
  const [blogPosts, galleryItems] = await Promise.all([
    getBlogPosts(),
    getGalleryItems()
  ]);

  return renderPublicPage(req, res, "public/pages/index", {
    blogPosts,
    enquiryFormOptions,
    galleryItems,
    ...variantOptions
  });
}

function home(req, res) {
  return renderHome(req, res, {
    homeVariant: "grid",
    showCategoryGrid: true,
    showDecorativeZigzag: false
  });
}

function homeGrid(req, res) {
  return renderHome(req, res, {
    homeVariant: "grid",
    showCategoryGrid: true,
    showDecorativeZigzag: false
  });
}

function homeZigzag(req, res) {
  return renderHome(req, res, {
    homeVariant: "zigzag",
    showCategoryGrid: false,
    showDecorativeZigzag: true
  });
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

function termsAndConditions(req, res) {
  return renderPublicPage(req, res, "public/pages/legal-page", {
    pageTitle: "Terms & Conditions | Pioneer Decor",
    pageDescription:
      "Read the website terms and conditions for Pioneer Decor product information, enquiries, catalogues, and website use.",
    hero: {
      tag: "(Legal)",
      title: "Terms & Conditions",
      text: "Guidelines for using the Pioneer Decor website, product information, enquiries, and catalogue resources."
    },
    sections: [
      {
        title: "Website Use",
        body: [
          "This website is provided for general information about Pioneer Decor products, infrastructure, catalogues, and contact channels.",
          "By using this website, you agree to use the content only for lawful enquiry, evaluation, and business communication purposes."
        ]
      },
      {
        title: "Product Information",
        body: [
          "Product images, shades, dimensions, specifications, and application notes are indicative and may vary by batch, screen display, installation condition, or project requirement.",
          "Final suitability should be confirmed through samples, technical discussion, and written commercial confirmation from Pioneer Decor."
        ]
      },
      {
        title: "Quotations & Orders",
        body: [
          "Website enquiries do not create a confirmed order, supply commitment, price lock, or delivery obligation.",
          "Prices, taxes, freight, availability, lead times, and order terms are confirmed separately by the Pioneer Decor team."
        ]
      },
      {
        title: "Intellectual Property",
        body: [
          "The Pioneer Decor name, website content, product visuals, catalogues, graphics, and layout are owned by or licensed to Pioneer Decor.",
          "Content from this website may not be copied, republished, modified, or used commercially without prior written permission."
        ]
      },
      {
        title: "Limitation",
        body: [
          "Pioneer Decor works to keep website information useful and current, but does not guarantee that all content is complete, error-free, or suitable for every project condition.",
          "For project-critical decisions, please contact Pioneer Decor directly for the latest technical and commercial details."
        ]
      }
    ]
  });
}

function privacyPolicy(req, res) {
  return renderPublicPage(req, res, "public/pages/legal-page", {
    pageTitle: "Privacy Policy | Pioneer Decor",
    pageDescription:
      "Learn how Pioneer Decor handles website enquiry, catalogue, and contact information submitted through the website.",
    hero: {
      tag: "(Legal)",
      title: "Privacy Policy",
      text: "How Pioneer Decor handles information shared through enquiry forms, catalogue access, and contact requests."
    },
    sections: [
      {
        title: "Information We Collect",
        body: [
          "When you submit a form, request a catalogue, or contact Pioneer Decor, we may collect details such as your name, phone number, email address, company, city, product interest, and message.",
          "Basic technical information may also be processed to help maintain website performance and security."
        ]
      },
      {
        title: "How We Use Information",
        body: [
          "We use submitted information to respond to enquiries, share catalogues, coordinate samples, discuss product requirements, and improve customer communication.",
          "We may also use enquiry context to understand demand for product categories and service improvements."
        ]
      },
      {
        title: "Sharing",
        body: [
          "Information may be shared with authorised Pioneer Decor team members, service providers, or business partners only where needed to respond to your request or support operations.",
          "We do not sell submitted enquiry information as a standalone product."
        ]
      },
      {
        title: "Retention & Security",
        body: [
          "We retain enquiry information for as long as reasonably needed for business communication, record keeping, service follow-up, and legal or operational requirements.",
          "Reasonable safeguards are used to protect submitted information, though no website or transmission method can be guaranteed completely secure."
        ]
      },
      {
        title: "Contact",
        body: [
          "For privacy-related questions or correction requests, contact Pioneer Decor through the website contact form or email sks@pioneerflex.in.",
          "We may update this policy as website features, business processes, or legal requirements evolve."
        ]
      }
    ]
  });
}

function thankYou(req, res) {
  return renderPublicPage(req, res, "public/pages/thank-you", {
    pageTitle: "Thank You | Pioneer Decor",
    pageDescription: "Thank you for submitting your details to Pioneer Decor."
  });
}

async function sitemap(req, res) {
  return renderPublicPage(req, res, "public/pages/sitemap", {
    pageTitle: "Sitemap | Pioneer Decor",
    pageDescription: "Browse key Pioneer Decor website pages, product categories, company information, catalogues, and contact links.",
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

function indexRedirect(req, res) {
  res.redirect(301, "/");
}

module.exports = {
  aboutCompany,
  career,
  careerOpening,
  home,
  homeGrid,
  homeZigzag,
  infrastructure,
  indexRedirect,
  privacyPolicy,
  robotsTxt,
  sitemap,
  sitemapXml,
  thankYou,
  termsAndConditions
};
