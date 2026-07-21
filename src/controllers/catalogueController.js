const Catalogue = require("../models/Catalogue");
const Enquiry = require("../models/Enquiry");
const { getSiteSetting } = require("../services/siteSettingService");
const { renderPublicPage } = require("../services/viewRenderer");

async function getCatalogues() {
  return Catalogue.find({ active: true })
    .sort({ order: 1, title: 1 })
    .lean();
}

async function eCatalogue(req, res) {
  const catalogues = await getCatalogues();
  return renderPublicPage(req, res, "public/pages/e-catalogue", { catalogues });
}

async function submitCatalogueLead(req, res) {
  const messages = await getSiteSetting("responseMessages");
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
    message: messages.catalogue.downloadsUnlocked,
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
