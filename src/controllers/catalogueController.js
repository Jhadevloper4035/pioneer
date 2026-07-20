const mongoose = require("mongoose");
const catalogueSeed = require("../data/catalogues.json");
const Catalogue = require("../models/Catalogue");
const Enquiry = require("../models/Enquiry");
const { renderPublicPage } = require("../services/viewRenderer");

async function getCatalogues() {
  if (mongoose.connection.readyState !== 1) {
    return catalogueSeed;
  }

  const catalogues = await Catalogue.find({ active: true })
    .sort({ order: 1, title: 1 })
    .lean();

  return catalogues.length ? catalogues : catalogueSeed;
}

async function eCatalogue(req, res) {
  const catalogues = await getCatalogues();
  return renderPublicPage(req, res, "public/pages/e-catalogue", { catalogues });
}

async function submitCatalogueLead(req, res) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Catalogue form is temporarily unavailable. Please try again shortly."
    });
  }

  const enquiry = await Enquiry.create({
    source: "catalogue",
    name: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    company: req.body.company,
    city: req.body.city,
    product: req.body.interestedCatalogue,
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  });

  return res.status(201).json({
    success: true,
    message: "Catalogue downloads unlocked",
    data: {
      id: enquiry._id,
      catalogues: await getCatalogues()
    }
  });
}

module.exports = {
  eCatalogue,
  submitCatalogueLead
};
