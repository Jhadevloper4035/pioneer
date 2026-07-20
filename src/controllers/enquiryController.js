const mongoose = require("mongoose");
const enquiryFormOptions = require("../data/enquiryFormOptions.json");
const CareerApplication = require("../models/CareerApplication");
const Enquiry = require("../models/Enquiry");
const { renderPublicPage } = require("../services/viewRenderer");

function contact(req, res) {
  return renderPublicPage(req, res, "public/pages/contact-us", { enquiryFormOptions });
}

function normalizeProductCategories(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

async function createEnquiry(req, res, source, fields) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Enquiry form is temporarily unavailable. Please try again shortly."
    });
  }

  const enquiry = await Enquiry.create({
    source,
    ...fields,
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  });

  return res.status(201).json({
    success: true,
    message: "Enquiry submitted successfully. Our team will contact you soon.",
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

async function submitCareerApplication(req, res) {
  const { role, name, email, phone, experience, city, message } = req.body;
  const requiredFields = { role, name, email, phone, experience, city };
  const missingField = Object.entries(requiredFields).find(([, value]) => !value || !String(value).trim());

  if (missingField) {
    return res.status(400).json({
      success: false,
      message: "Please complete all required application details."
    });
  }

  if (!req.file?.buffer) {
    return res.status(400).json({
      success: false,
      message: "Please upload your resume."
    });
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Career applications are temporarily unavailable. Please try again shortly."
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

  return res.status(201).json({
    success: true,
    message: "Application submitted successfully. Our team will review your profile and connect soon.",
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
