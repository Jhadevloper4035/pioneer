const { Readable } = require("stream");
const mongoose = require("mongoose");
const { SitemapStream, streamToPromise } = require("sitemap");
const env = require("../config/env");
const { careerOpenings, blogPosts } = require("../data/siteContent");
const { getLouverData } = require("../data/wpcLouvers");
const LouverProduct = require("../models/LouverProduct");

const staticSections = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/", changefreq: "weekly", priority: 1 },
      { label: "About Company", href: "/about-company", changefreq: "monthly", priority: 0.8 },
      { label: "Infrastructure", href: "/infrastructure", changefreq: "monthly", priority: 0.8 },
      { label: "Gallery", href: "/gallery", changefreq: "monthly", priority: 0.6 },
      { label: "Career", href: "/career", changefreq: "monthly", priority: 0.5 },
      { label: "Contact Us", href: "/contact-us", changefreq: "monthly", priority: 0.7 }
    ]
  },
  {
    title: "Products",
    links: [
      { label: "PVC Decorative Films", href: "/pvc-decorative-film", changefreq: "weekly", priority: 0.9 },
      { label: "PVC/WPC Interior Louvers", href: "/pvc-wpc-interior-louvers", changefreq: "weekly", priority: 0.9 },
      { label: "WPC Doors", href: "/wpc-doors", changefreq: "weekly", priority: 0.8 },
      { label: "WPC Door Frames", href: "/wpc-door-frames", changefreq: "weekly", priority: 0.8 },
      { label: "PVC/WPC Baffles", href: "/pvc-wpc-baffles", changefreq: "weekly", priority: 0.8 }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "E-Catalogue", href: "/e-catalogue", changefreq: "monthly", priority: 0.6 },
      { label: "Blog", href: "/blog", changefreq: "weekly", priority: 0.6 },
      { label: "Sitemap", href: "/sitemap", changefreq: "monthly", priority: 0.3 },
      { label: "Terms & Conditions", href: "/terms-and-conditions", changefreq: "yearly", priority: 0.2 },
      { label: "Privacy Policy", href: "/privacy-policy", changefreq: "yearly", priority: 0.2 }
    ]
  }
];

function getSiteUrl(req) {
  if (env.siteUrl) return env.siteUrl;
  return `${req.protocol}://${req.get("host")}`.replace(/\/+$/, "");
}

async function getLouverProducts() {
  if (mongoose.connection.readyState === 1) {
    const products = await LouverProduct.find({ active: true })
      .sort({ order: 1, productId: 1 })
      .lean();

    if (products.length) return getLouverData(products).products;
  }

  return getLouverData().products;
}

async function getSitemapSections() {
  const louverProducts = await getLouverProducts();

  return [
    staticSections[0],
    {
      ...staticSections[1],
      links: [
        ...staticSections[1].links,
        ...louverProducts.map((product) => ({
          label: product.name,
          href: `/wpc-louvers/${product.slug}`,
          changefreq: "weekly",
          priority: 0.7
        }))
      ]
    },
    {
      ...staticSections[2],
      links: [
        ...staticSections[2].links,
        ...blogPosts.map((post) => ({
          label: post.title,
          href: `/blog/${post.slug}`,
          changefreq: "monthly",
          priority: 0.5
        })),
        ...careerOpenings.map((opening) => ({
          label: opening.title,
          href: `/career/${opening.slug}`,
          changefreq: "monthly",
          priority: 0.4
        }))
      ]
    }
  ];
}

async function getSitemapLinks() {
  const sections = await getSitemapSections();
  return sections.flatMap((section) => section.links);
}

async function generateSitemapXml(req) {
  const stream = new SitemapStream({ hostname: getSiteUrl(req) });
  const links = (await getSitemapLinks()).map(({ href, label, ...entry }) => ({
    ...entry,
    url: href
  }));
  const xml = await streamToPromise(
    Readable.from(links).pipe(stream)
  );

  return xml.toString();
}

function generateRobotsTxt(req) {
  const siteUrl = getSiteUrl(req);

  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    ""
  ].join("\n");
}

module.exports = {
  generateRobotsTxt,
  generateSitemapXml,
  getSitemapSections
};
