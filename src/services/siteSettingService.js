const SiteSetting = require("../models/SiteSetting");
const AppError = require("../utils/AppError");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientMongoError(error) {
  return error?.code === "EAI_AGAIN"
    || error?.code === "ETIMEOUT"
    || error?.cause?.code === "EAI_AGAIN"
    || error?.cause?.code === "ETIMEOUT"
    || error?.errorLabelSet?.has?.("RetryableError")
    || error?.errorLabelSet?.has?.("ResetPool");
}

async function findSetting(key) {
  try {
    return await SiteSetting.findOne({ key, active: true }).lean();
  } catch (error) {
    if (!isTransientMongoError(error)) throw error;
    await wait(300);
    return SiteSetting.findOne({ key, active: true }).lean();
  }
}

const emptyLegalPage = {
  hero: { tag: "", title: "", text: "" },
  sections: []
};

const defaultSettings = {
  adminPages: {
    dashboard: "Dashboard",
    login: "Login",
    users: "Users"
  },
  enquiryFormOptions: {
    applications: [],
    productCategories: [],
    quantities: [],
    units: []
  },
  publicPageContent: {
    privacyPolicy: emptyLegalPage,
    sitemap: {},
    termsAndConditions: emptyLegalPage,
    thankYou: {}
  },
  responseMessages: {
    adminApi: {
      seoPageDeleted: "Deleted",
      seoPageSaved: "Saved"
    },
    auth: {
      accountCreated: "Created",
      loginSuccessful: "Login successful",
      registrationDisabled: "Registration disabled"
    },
    careerApplication: {
      missingDetails: "Please complete all required details.",
      missingResume: "Please upload your resume.",
      success: "Submitted"
    },
    catalogue: {
      downloadsUnlocked: "Submitted"
    },
    enquiry: {
      success: "Submitted"
    },
    product: {
      louverNotFound: "Product not found"
    }
  }
};

async function getSiteSetting(key, defaultValue) {
  const setting = await findSetting(key);

  if (!setting) {
    if (arguments.length > 1) return defaultValue;
    if (Object.prototype.hasOwnProperty.call(defaultSettings, key)) return defaultSettings[key];
    throw new AppError(`Missing site setting: ${key}`, 500);
  }

  return setting.value;
}

module.exports = {
  getSiteSetting
};
