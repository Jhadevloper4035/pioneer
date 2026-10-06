const path = require("path");
const CareerApplication = require("../models/CareerApplication");
const AppError = require("../utils/AppError");
const env = require("../config/env");
const { signJwt, verifyJwt } = require("../utils/jwt");

const linkOptions = {
  audience: "pioneer-career-resume",
  expiresIn: "7d",
  issuer: `${env.jwtIssuer}:career-resume`,
  secret: env.jwtSecret
};

function createResumeDownloadLink(applicationId) {
  if (!env.siteUrl) return "";

  const { token } = signJwt({ sub: String(applicationId), type: "career-resume" }, linkOptions);
  return `${env.siteUrl}/resume/${token}`;
}

function resumeIdFromLink(token) {
  const payload = verifyJwt(token, linkOptions);
  if (payload.type !== "career-resume" || !payload.sub) {
    throw new AppError("Invalid resume download link", 401);
  }

  return payload.sub;
}

async function sendCareerResume(res, applicationId) {
  const application = await CareerApplication.findById(applicationId).select("resume").lean();
  if (!application?.resume?.data) {
    throw new AppError("Resume not found", 404);
  }

  const filename = path.basename(application.resume.filename || "resume");
  const extension = path.extname(filename).toLowerCase();
  const contentType = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  }[extension] || "application/octet-stream";

  res.set("X-Content-Type-Options", "nosniff");
  res.attachment(filename);
  res.type(contentType);
  return res.send(application.resume.data);
}

module.exports = {
  createResumeDownloadLink,
  resumeIdFromLink,
  sendCareerResume
};
