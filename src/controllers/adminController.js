const env = require("../config/env");
const mongoose = require("mongoose");
const CareerApplication = require("../models/CareerApplication");
const CareerOpening = require("../models/CareerOpening");
const Enquiry = require("../models/Enquiry");
const AppError = require("../utils/AppError");
const { getSiteSetting } = require("../services/siteSettingService");
const { sendCareerResume } = require("../services/careerResumeService");
const { renderAdminPageWithLayout } = require("../services/viewRenderer");

async function emailNotificationCount(status) {
  const [enquiries, applications] = await Promise.all([
    Enquiry.countDocuments({ "emailNotification.status": status }),
    CareerApplication.countDocuments({ "emailNotification.status": status })
  ]);

  return enquiries + applications;
}

function redirectAdmin(req, res) {
  res.redirect("/admin/dashboard");
}

function renderAdminPage(view, titleKey, options = {}) {
  return async (req, res) => {
    const adminPages = await getSiteSetting("adminPages");

    return renderAdminPageWithLayout(req, res, `admin/pages/${view}`, {
      appName: env.appName,
      pageTitle: adminPages[titleKey],
      ...options
    });
  };
}

const renderAdminLogin = renderAdminPage("login", "login", { useAdminShell: false });

async function renderAdminDashboard(req, res) {
  const [adminPages, enquiryCount, applicationCount, activeJobPostCount, emailSentCount, emailFailedCount, recentEnquiries, recentApplications] = await Promise.all([
    getSiteSetting("adminPages"),
    Enquiry.countDocuments(),
    CareerApplication.countDocuments(),
    CareerOpening.countDocuments({ active: true }),
    emailNotificationCount("sent"),
    emailNotificationCount("failed"),
    Enquiry.find().select("name email phone product city source createdAt").sort({ createdAt: -1 }).limit(5).lean(),
    CareerApplication.find().select("name email phone role city experience createdAt").sort({ createdAt: -1 }).limit(5).lean()
  ]);

  return renderAdminPageWithLayout(req, res, "admin/pages/dashboard", {
    appName: env.appName,
    pageTitle: adminPages.dashboard,
    recentApplications,
    recentEnquiries,
    totals: {
      activeJobPosts: activeJobPostCount,
      applications: applicationCount,
      emailFailed: emailFailedCount,
      emailSent: emailSentCount,
      enquiries: enquiryCount
    }
  });
}

function renderAdminSubmissions(req, res, options) {
  return renderAdminPageWithLayout(req, res, "admin/pages/enquiries", {
    appName: env.appName,
    ...options
  });
}

async function renderAdminEnquiries(req, res) {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();

  return renderAdminSubmissions(req, res, {
    enquiries,
    emptyMessage: "No contact enquiries yet.",
    exportFilename: "pioneer-contact-enquiries.csv",
    itemLabel: "enquiries",
    itemLabelSingular: "enquiry",
    pageTitle: "Contact enquiries",
    personLabel: "Customer",
    sectionTitle: "Contact enquiries",
    sourceOptions: [
      { value: "contact", label: "Contact" },
      { value: "product", label: "Product" },
      { value: "catalogue", label: "Catalogue" },
      { value: "homepage", label: "Homepage" }
    ]
  });
}

async function renderAdminJobEnquiries(req, res) {
  const applications = await CareerApplication.find()
    .select("-resume.data")
    .sort({ createdAt: -1 })
    .lean();
  const enquiries = applications.map((application) => ({
    source: "career",
    name: application.name,
    email: application.email,
    phone: application.phone,
    city: application.city,
    product: `Job application — ${application.role}`,
    application: `Experience: ${application.experience}`,
    message: application.message,
    resume: application.resume?.filename
      ? {
          filename: application.resume.originalName || application.resume.filename,
          url: `/admin/job-enquiries/${application._id}/resume`
        }
      : null,
    createdAt: application.createdAt
  }));

  return renderAdminSubmissions(req, res, {
    enquiries,
    emptyMessage: "No job applications yet.",
    exportFilename: "pioneer-job-applications.csv",
    itemLabel: "applications",
    itemLabelSingular: "application",
    pageTitle: "Job applications",
    personLabel: "Candidate",
    sectionTitle: "Job applications",
    sourceOptions: []
  });
}

async function downloadCareerResume(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    throw new AppError("Invalid job application id", 400);
  }

  return sendCareerResume(res, req.params.id);
}

async function renderAdminJobPosts(req, res) {
  const jobPosts = await CareerOpening.find().sort({ createdAt: -1 }).lean();

  return renderAdminPageWithLayout(req, res, "admin/pages/job-posts", {
    appName: env.appName,
    jobPosts,
    pageTitle: "Job posts"
  });
}

async function renderAdminJobPostDetail(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    throw new AppError("Invalid job post id", 400);
  }

  const jobPost = await CareerOpening.findById(req.params.id).lean();
  if (!jobPost) throw new AppError("Job post not found", 404);

  return renderAdminPageWithLayout(req, res, "admin/pages/job-post-detail", {
    appName: env.appName,
    jobPost,
    pageTitle: jobPost.title
  });
}

async function renderAdminCreateJobPost(req, res) {
  let jobPost = null;

  if (req.query.edit) {
    if (!mongoose.isObjectIdOrHexString(req.query.edit)) {
      throw new AppError("Invalid job post id", 400);
    }

    jobPost = await CareerOpening.findById(req.query.edit).lean();
    if (!jobPost) throw new AppError("Job post not found", 404);
  }

  return renderAdminPageWithLayout(req, res, "admin/pages/create-job-post", {
    appName: env.appName,
    jobPost,
    pageTitle: jobPost ? "Edit job post" : "Create job post"
  });
}

const renderAdminUsers = renderAdminPage("users", "users");

module.exports = {
  redirectAdmin,
  renderAdminDashboard,
  renderAdminCreateJobPost,
  downloadCareerResume,
  renderAdminEnquiries,
  renderAdminJobEnquiries,
  renderAdminJobPostDetail,
  renderAdminJobPosts,
  renderAdminLogin,
  renderAdminUsers
};
