const assert = require("node:assert/strict");
const env = require("../src/config/env");
const verifyRecaptcha = require("../src/middleware/verifyRecaptcha");

const originalFetch = global.fetch;
const originalSecret = env.recaptcha.secretKey;
const originalScore = env.recaptcha.minScore;
env.recaptcha.secretKey = "recaptcha-secret";
env.recaptcha.minScore = 0.5;

function response() {
  return {
    statusCode: 200,
    body: null,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

async function run() {
  global.fetch = async (_url, options) => {
    assert.match(options.body.toString(), /secret=recaptcha-secret/);
    assert.match(options.body.toString(), /response=token/);
    return {
      ok: true,
      json: async () => ({ success: true, action: "contact", score: 0.9 })
    };
  };

  let continued = false;
  await verifyRecaptcha("contact")({ body: { recaptchaToken: "token" } }, response(), () => {
    continued = true;
  });
  assert.equal(continued, true, "valid token should continue to the controller");

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ success: true, action: "contact", score: 0.2 })
  });
  const rejected = response();
  await verifyRecaptcha("contact")({ body: { recaptchaToken: "token" } }, rejected, () => {});
  assert.equal(rejected.statusCode, 403, "low score should be rejected");

  global.fetch = async () => ({
    ok: true,
    json: async () => ({ success: true, action: "product_enquiry", score: 0.9 })
  });
  const wrongAction = response();
  await verifyRecaptcha("contact")({ body: { recaptchaToken: "token" } }, wrongAction, () => {});
  assert.equal(wrongAction.statusCode, 403, "wrong action should be rejected");

  const missing = response();
  await verifyRecaptcha("contact")({ body: {} }, missing, () => {});
  assert.equal(missing.statusCode, 400, "missing token should be rejected");
}

run()
  .then(() => console.log("reCAPTCHA middleware check passed."))
  .finally(() => {
    global.fetch = originalFetch;
    env.recaptcha.secretKey = originalSecret;
    env.recaptcha.minScore = originalScore;
  });
