const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = path.join(__dirname, "..");
const baseEnv = {
  ...process.env,
  NODE_ENV: "production",
  DATABASE_URL: "",
  MONGODB_URI: "mongodb+srv://user:password@cluster.example/pioneer",
  SITE_URL: "https://pioneerdecor.in",
  JWT_SECRET: "a-32-character-production-secret-key",
  RECAPTCHA_SECRET_KEY: "recaptcha-secret",
  RECAPTCHA_SITE_KEY: "recaptcha-site-key",
  SMTP_FROM: "Pioneer Decor <admin@pioneerdecor.in>",
  SMTP_HOST: "smtpout.secureserver.net",
  SMTP_PASS: "mailbox-password",
  SMTP_PORT: "465",
  SMTP_SECURE: "true",
  SMTP_USER: "admin@pioneerdecor.in"
};

function loadEnv(overrides = {}) {
  return spawnSync(process.execPath, ["-e", "require('./src/config/env')"], {
    cwd: root,
    encoding: "utf8",
    env: { ...baseEnv, ...overrides }
  });
}

assert.equal(loadEnv().status, 0, "complete production configuration should load");

const missingMongo = loadEnv({ DATABASE_URL: "", MONGODB_URI: "" });
assert.notEqual(missingMongo.status, 0, "missing MongoDB configuration should fail");
assert.match(missingMongo.stderr, /MONGODB_URI/);

const missingSmtp = loadEnv({ SMTP_PASS: "" });
assert.notEqual(missingSmtp.status, 0, "missing SMTP configuration should fail");
assert.match(missingSmtp.stderr, /SMTP_PASS/);

const missingRecaptcha = loadEnv({ RECAPTCHA_SECRET_KEY: "" });
assert.notEqual(missingRecaptcha.status, 0, "missing reCAPTCHA configuration should fail");
assert.match(missingRecaptcha.stderr, /RECAPTCHA_SECRET_KEY/);

console.log("Production environment validation check passed.");
