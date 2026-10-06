const assert = require("node:assert/strict");
const nodemailer = require("nodemailer");
const env = require("../src/config/env");
const { buildLeadEmail, notifyEnquiry } = require("../src/services/leadNotificationService");

const resume = Buffer.from("resume content");
const message = buildLeadEmail({
  title: "New job application",
  fields: { Name: "Asha", Resume: "asha-resume.pdf" },
  downloadUrl: "https://pioneerdecor.in/resume/token",
  attachments: [{
    filename: "asha-resume.pdf",
    content: resume,
    contentType: "application/pdf"
  }]
});

async function run() {
  assert.match(message.text, /Name: Asha/);
  assert.match(message.html, /asha-resume\.pdf/);
  assert.match(message.html, /href="https:\/\/pioneerdecor\.in\/resume\/token"/);
  assert.match(message.text, /Download resume: https:\/\/pioneerdecor\.in\/resume\/token/);
  assert.deepEqual(message.attachments, [{
    filename: "asha-resume.pdf",
    content: resume,
    contentType: "application/pdf"
  }]);

  const smtp = { ...env.smtp };
  const updates = [];
  Object.assign(env.smtp, { from: "", host: "", password: "", user: "" });

  try {
    const sent = await notifyEnquiry({
      _id: "lead-1",
      source: "contact",
      name: "Asha",
      updateOne: async (update) => updates.push(update)
    });

    assert.equal(sent, false);
    assert.equal(updates.length, 1);
    assert.equal(updates[0].$set.emailNotification.status, "failed");
    assert.ok(updates[0].$set.emailNotification.attemptedAt instanceof Date);
  } finally {
    Object.assign(env.smtp, smtp);
  }

  const createTransport = nodemailer.createTransport;
  const outcomes = [
    { accepted: ["decor@pioneerflex.in"], rejected: [] },
    { accepted: [], rejected: ["decor@pioneerflex.in"] }
  ];
  const sentUpdates = [];
  const rejectedUpdates = [];
  Object.assign(env.smtp, { from: "from@example.com", host: "smtp.example.com", password: "password", user: "user" });
  nodemailer.createTransport = () => ({ sendMail: async () => outcomes.shift() });

  try {
    assert.equal(await notifyEnquiry({
      _id: "lead-2",
      source: "contact",
      name: "Asha",
      updateOne: async (update) => sentUpdates.push(update)
    }), true);
    assert.equal(sentUpdates[0].$set.emailNotification.status, "sent");

    assert.equal(await notifyEnquiry({
      _id: "lead-3",
      source: "contact",
      name: "Asha",
      updateOne: async (update) => rejectedUpdates.push(update)
    }), false);
    assert.equal(rejectedUpdates[0].$set.emailNotification.status, "failed");
  } finally {
    nodemailer.createTransport = createTransport;
    Object.assign(env.smtp, smtp);
  }

  console.log("Lead email notification status check passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
