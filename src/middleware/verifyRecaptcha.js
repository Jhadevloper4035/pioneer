const env = require("../config/env");
const { logger } = require("../config/logger");

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

function verifyRecaptcha(expectedAction) {
  return async (req, res, next) => {
    const token = req.body?.recaptchaToken;

    if (!env.recaptcha.secretKey) {
      logger.error({ action: expectedAction }, "reCAPTCHA is not configured");
      return res.status(503).json({
        success: false,
        message: "Form verification is temporarily unavailable. Please try again later."
      });
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Form verification is required. Please try again."
      });
    }

    try {
      const response = await fetch(VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          response: token,
          secret: env.recaptcha.secretKey
        })
      });
      const result = await response.json();

      if (
        !response.ok ||
        !result.success ||
        result.action !== expectedAction ||
        typeof result.score !== "number" ||
        result.score < env.recaptcha.minScore
      ) {
        return res.status(403).json({
          success: false,
          message: "Form verification failed. Please try again."
        });
      }

      return next();
    } catch (error) {
      logger.error({ err: error, action: expectedAction }, "reCAPTCHA verification request failed");
      return res.status(503).json({
        success: false,
        message: "Form verification is temporarily unavailable. Please try again later."
      });
    }
  };
}

module.exports = verifyRecaptcha;
