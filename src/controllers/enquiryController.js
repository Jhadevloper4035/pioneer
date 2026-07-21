const CareerApplication = require("../models/CareerApplication");
const Enquiry = require("../models/Enquiry");
const { getSiteSetting } = require("../services/siteSettingService");
const { renderPublicPage } = require("../services/viewRenderer");

const emptyEnquiryFormOptions = {
  productCategories: []
};

async function contact(req, res) {
  const enquiryFormOptions = await getSiteSetting("enquiryFormOptions", emptyEnquiryFormOptions);
  return renderPublicPage(req, res, "public/pages/contact-us", { enquiryFormOptions });
}

function normalizeProductCategories(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

async function createEnquiry(req, res, source, fields) {
  const messages = await getSiteSetting("responseMessages");
  const enquiry = await Enquiry.create({
    source,
    ...fields,
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  });

  return res.status(201).json({
    success: true,
    message: messages.enquiry.success,
    data: {
      id: enquiry._id
    }
  });
}

function submitContact(req, res) {
  return createEnquiry(req, res, "contact", {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    productCategories: normalizeProductCategories(req.body.productCategories),
    message: req.body.message
  });
}

function submitEnquiry(req, res) {
  return createEnquiry(req, res, "homepage", {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    city: req.body.city,
    product: req.body.product,
    quantity: req.body.quantity,
    unit: req.body.unit,
    application: req.body.application,
    comments: req.body.comments
  });
}

function submitProductEnquiry(req, res) {
  return createEnquiry(req, res, "product", {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    city: req.body.city,
    product: req.body.product,
    message: req.body.message
  });
}

function wantsJson(req) {
  const accept = req.get("accept") || "";
  return req.xhr || (accept.includes("application/json") && !accept.includes("text/html"));
}

async function submitCareerApplication(req, res) {
  const messages = await getSiteSetting("responseMessages");
  const { role, name, email, phone, experience, city, message } = req.body;
  const requiredFields = { role, name, email, phone, experience, city };
  const missingField = Object.entries(requiredFields).find(([, value]) => !value || !String(value).trim());

  if (missingField) {
    return res.status(400).json({
      success: false,
      message: messages.careerApplication.missingDetails
    });
  }

  if (!req.file?.buffer) {
    return res.status(400).json({
      success: false,
      message: messages.careerApplication.missingResume
    });
  }

  const application = await CareerApplication.create({
    role,
    name,
    email,
    phone,
    experience,
    city,
    message,
    resume: {
      data: req.file.buffer,
      filename: req.file.filename,
      originalName: req.file.originalName,
      mimetype: req.file.mimetype,
      size: req.file.size
    },
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  });

  if (!wantsJson(req)) {
    return res.redirect(303, "/thank-you");
  }

  return res.status(201).json({
    success: true,
    message: messages.careerApplication.success,
    data: {
      id: application._id,
      role,
      name,
      email,
      phone,
      experience,
      city,
      message,
      resume: req.file
        ? {
            filename: req.file.filename,
            originalName: req.file.originalName,
            size: req.file.size
          }
        : null
    }
  });
}

module.exports = {
  contact,
  submitCareerApplication,
  submitContact,
  submitEnquiry,
  submitProductEnquiry
};
