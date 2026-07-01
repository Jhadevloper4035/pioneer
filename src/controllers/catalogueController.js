const mongoose = require("mongoose");
const catalogues = require("../data/catalogues");
const CatalogueLead = require("../models/CatalogueLead");

function eCatalogue(req, res) {
  res.render("e-catalogue", { catalogues });
}

async function submitCatalogueLead(req, res) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Catalogue form is temporarily unavailable. Please try again shortly."
    });
  }

  const lead = await CatalogueLead.create({
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    company: req.body.company,
    city: req.body.city,
    interestedCatalogue: req.body.interestedCatalogue,
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  });

  return res.status(201).json({
    success: true,
    message: "Catalogue downloads unlocked",
    data: {
      id: lead._id,
      catalogues
    }
  });
}

module.exports = {
  eCatalogue,
  submitCatalogueLead
};
