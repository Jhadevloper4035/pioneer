const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", "..", ".env");

function parseEnvLine(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) return null;

  const separatorIndex = trimmed.indexOf("=");
  if (separatorIndex === -1) return null;

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (!key) return null;

  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

function loadEnv() {
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  lines.forEach((line) => {
    const parsed = parseEnvLine(line);
    if (!parsed || Object.prototype.hasOwnProperty.call(process.env, parsed.key)) {
      return;
    }

    process.env[parsed.key] = parsed.value;
  });
}

loadEnv();

function getMongoUri() {
  return process.env.MONGODB_URI || process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/pioneer";
}

const nodeEnv = process.env.NODE_ENV || "development";

const env = {
  allowPublicRegistration:
    process.env.ALLOW_PUBLIC_REGISTRATION === "true" || nodeEnv !== "production",
  appName: process.env.APP_NAME || "Pioneer",
  assetRoute: process.env.ASSET_ROUTE || "/assets",
  host: process.env.HOST || (nodeEnv === "production" ? "0.0.0.0" : "127.0.0.1"),
  jwtAudience: process.env.JWT_AUDIENCE || "pioneer-users",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtIssuer: process.env.JWT_ISSUER || "pioneer-api",
  jwtSecret: process.env.JWT_SECRET || "replace-this-development-secret",
  mongoUri: getMongoUri(),
  nodeEnv,
  port: Number.parseInt(process.env.PORT || "3000", 10),
  recaptcha: {
    minScore: Number.parseFloat(process.env.RECAPTCHA_MIN_SCORE || "0.5"),
    secretKey: process.env.RECAPTCHA_SECRET_KEY || "",
    siteKey: process.env.RECAPTCHA_SITE_KEY || ""
  },
  siteUrl: (process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "").replace(/\/+$/, ""),
  smtp: {
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "",
    host: process.env.SMTP_HOST || "",
    password: process.env.SMTP_PASS || "",
    port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || ""
  }
};

if (!/^mongodb(\+srv)?:\/\//.test(env.mongoUri)) {
  throw new Error(
    "MONGODB_URI must start with mongodb:// or mongodb+srv://. Check your .env file."
  );
}

if (env.nodeEnv === "production") {
  const required = {
    MONGODB_URI: process.env.MONGODB_URI || process.env.DATABASE_URL,
    SITE_URL: env.siteUrl,
    SMTP_FROM: env.smtp.from,
    SMTP_HOST: env.smtp.host,
    SMTP_PASS: env.smtp.password,
    SMTP_USER: env.smtp.user,
    RECAPTCHA_SECRET_KEY: env.recaptcha.secretKey,
    RECAPTCHA_SITE_KEY: env.recaptcha.siteKey
  };
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(`Missing production environment variables: ${missing.join(", ")}`);
  }

  if (!env.siteUrl.startsWith("https://")) {
    throw new Error("SITE_URL must use https in production");
  }

  if (env.jwtSecret.includes("replace-this") || env.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }

  if (!Number.isInteger(env.smtp.port) || env.smtp.port < 1 || env.smtp.port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number");
  }

  if (!Number.isFinite(env.recaptcha.minScore) || env.recaptcha.minScore < 0 || env.recaptcha.minScore > 1) {
    throw new Error("RECAPTCHA_MIN_SCORE must be a number between 0 and 1");
  }
}

module.exports = env;
