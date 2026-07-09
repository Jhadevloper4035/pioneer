const mongoose = require("mongoose");
const CareerApplication = require("../models/CareerApplication");
const { renderPublicPage } = require("../services/viewRenderer");

function contact(req, res) {
  return renderPublicPage(req, res, "public/pages/contact-us");
}

function submitContact(req, res) {
  const { name, email, phone, message } = req.body;
  const productCategories = Array.isArray(req.body.productCategories)
    ? req.body.productCategories
    : req.body.productCategories
      ? [req.body.productCategories]
      : [];

  res.status(201).json({
    success: true,
    message: "Contact request received",
    data: { name, email, phone, productCategories, message }
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
  submitContact
};
