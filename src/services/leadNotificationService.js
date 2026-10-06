const nodemailer = require("nodemailer");
const env = require("../config/env");
const { logger } = require("../config/logger");
const { createResumeDownloadLink } = require("./careerResumeService");

const leadRecipients = ["sks@pioneerflex.in", "decor@pioneerflex.in"];
let transporter;

function escapeHtml(value) {
  return String(value ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTransporter() {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.password || !env.smtp.from) return null;

  transporter = transporter || nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.password }
  });

  return transporter;
}

function buildLeadEmail({ title, fields, attachments = [], downloadUrl = "" }) {
  const entries = Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== "");
  const text = [
    ...entries.map(([label, value]) => `${label}: ${value}`),
    ...(downloadUrl ? [`Download resume: ${downloadUrl}`] : [])
  ].join("\n");
  const html = entries
    .map(([label, value]) => `<tr><th align="left" style="padding:8px;border:1px solid #ddd">${escapeHtml(label)}</th><td style="padding:8px;border:1px solid #ddd">${escapeHtml(value)}</td></tr>`)
    .join("");

  return {
    subject: `Pioneer Decor: ${title}`,
    text: `${title}\n\n${text}`,
    html: `<h2>${escapeHtml(title)}</h2><table cellspacing="0" cellpadding="0" style="border-collapse:collapse">${html}</table>${downloadUrl ? `<p><a href="${escapeHtml(downloadUrl)}">Download resume</a> (available for 7 days)</p>` : ""}`,
    attachments: attachments.filter((attachment) => attachment?.content)
  };
}

async function recordNotificationStatus(lead, status) {
  try {
    await lead.updateOne({
      $set: {
        emailNotification: {
          status,
          attemptedAt: new Date()
        }
      }
    });
  } catch (error) {
    logger.error({ err: error, leadId: String(lead._id) }, "Could not record lead email notification status");
  }
}

async function notifyLead({ lead, title, fields, attachments, downloadUrl }) {
  const leadId = String(lead._id);
  const mailer = getTransporter();
  if (!mailer) {
    await recordNotificationStatus(lead, "failed");
    logger.warn({ leadId, type: title }, "Lead saved but SMTP is not configured");
    return false;
  }

  try {
    const message = buildLeadEmail({ title, fields, attachments, downloadUrl });
    const result = await mailer.sendMail({
      from: env.smtp.from,
      to: leadRecipients,
      ...message
    });

    if (!result.accepted?.length || result.rejected?.length) {
      await recordNotificationStatus(lead, "failed");
      logger.warn({ leadId, type: title }, "Lead notification email was rejected by SMTP");
      return false;
    }

    await recordNotificationStatus(lead, "sent");
    logger.info({ leadId, type: title }, "Lead notification email sent");
    return true;
  } catch (error) {
    await recordNotificationStatus(lead, "failed");
    logger.error({ err: error, leadId, type: title }, "Lead saved but notification email failed");
    return false;
  }
}

function notifyEnquiry(enquiry) {
  return notifyLead({
    lead: enquiry,
    title: "New enquiry",
    fields: {
      Source: enquiry.source,
      Name: enquiry.name,
      Email: enquiry.email,
      Phone: enquiry.phone,
      Company: enquiry.company,
      City: enquiry.city,
      Product: enquiry.product,
      "Product categories": enquiry.productCategories?.join(", "),
      Quantity: enquiry.quantity,
      Unit: enquiry.unit,
      Application: enquiry.application,
      Message: enquiry.message,
      Comments: enquiry.comments,
      Received: enquiry.createdAt?.toISOString?.()
    }
  });
}

function notifyJobApplication(application) {
  const resume = application.resume;

  return notifyLead({
    lead: application,
    title: "New job application",
    fields: {
      Role: application.role,
      Name: application.name,
      Email: application.email,
      Phone: application.phone,
      Experience: application.experience,
      City: application.city,
      Message: application.message,
      Resume: resume?.originalName,
      Received: application.createdAt?.toISOString?.()
    },
    downloadUrl: resume?.data ? createResumeDownloadLink(application._id) : "",
    attachments: resume?.data
      ? [{
          filename: resume.originalName || resume.filename || "resume",
          content: resume.data,
          contentType: resume.mimetype || "application/octet-stream"
        }]
      : []
  });
}

module.exports = {
  buildLeadEmail,
  notifyEnquiry,
  notifyJobApplication
};
