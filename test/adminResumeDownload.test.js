const assert = require("node:assert/strict");
const CareerApplication = require("../src/models/CareerApplication");
const { downloadCareerResume } = require("../src/controllers/adminController");
const env = require("../src/config/env");
const { createResumeDownloadLink, resumeIdFromLink } = require("../src/services/careerResumeService");

async function run() {
  const findById = CareerApplication.findById;
  const resume = Buffer.from("resume file");
  const response = {
    headers: {},
    attachment(filename) {
      this.filename = filename;
      return this;
    },
    send(value) {
      this.body = value;
      return this;
    },
    set(name, value) {
      this.headers[name] = value;
      return this;
    },
    type(value) {
      this.contentType = value;
      return this;
    }
  };

  CareerApplication.findById = () => ({
    select: () => ({
      lean: async () => ({
        resume: { data: resume, filename: "asha-resume.pdf" }
      })
    })
  });

  try {
    await downloadCareerResume({ params: { id: "507f1f77bcf86cd799439011" } }, response);
    assert.equal(response.filename, "asha-resume.pdf");
    assert.equal(response.contentType, "application/pdf");
    assert.equal(response.headers["X-Content-Type-Options"], "nosniff");
    assert.deepEqual(response.body, resume);
  } finally {
    CareerApplication.findById = findById;
  }

  const siteUrl = env.siteUrl;
  env.siteUrl = "https://pioneerdecor.in";
  try {
    const link = createResumeDownloadLink("507f1f77bcf86cd799439011");
    assert.match(link, /^https:\/\/pioneerdecor\.in\/resume\//);
    assert.equal(resumeIdFromLink(link.slice(link.lastIndexOf("/") + 1)), "507f1f77bcf86cd799439011");
  } finally {
    env.siteUrl = siteUrl;
  }

  console.log("Admin resume download check passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
