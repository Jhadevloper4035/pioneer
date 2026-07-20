const mongoose = require("mongoose");
const catalogues = require("../data/catalogues.json");
const Enquiry = require("../models/Enquiry");
const { renderPublicPage } = require("../services/viewRenderer");

function eCatalogue(req, res) {
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
      catalogues
    }
  });
}

module.exports = {
  eCatalogue,
  submitCatalogueLead
};
