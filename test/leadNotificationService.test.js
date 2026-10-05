const assert = require("node:assert/strict");
const { buildLeadEmail } = require("../src/services/leadNotificationService");

const resume = Buffer.from("resume content");
const message = buildLeadEmail({
  title: "New job application",
  fields: { Name: "Asha", Resume: "asha-resume.pdf" },
  attachments: [{
    filename: "asha-resume.pdf",
    content: resume,
    contentType: "application/pdf"
  }]
});

assert.match(message.text, /Name: Asha/);
assert.match(message.html, /asha-resume\.pdf/);
assert.deepEqual(message.attachments, [{
  filename: "asha-resume.pdf",
  content: resume,
  contentType: "application/pdf"
}]);

console.log("Lead email attachment check passed.");
