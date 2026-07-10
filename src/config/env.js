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
  host: process.env.HOST || "127.0.0.1",
  jwtAudience: process.env.JWT_AUDIENCE || "pioneer-users",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtIssuer: process.env.JWT_ISSUER || "pioneer-api",
  jwtSecret: process.env.JWT_SECRET || "replace-this-development-secret",
  mongoUri: getMongoUri(),
  nodeEnv,
  port: Number.parseInt(process.env.PORT || "3000", 10),
  siteUrl: (process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "").replace(/\/+$/, "")
};

if (!/^mongodb(\+srv)?:\/\//.test(env.mongoUri)) {
  throw new Error(
    "MONGODB_URI must start with mongodb:// or mongodb+srv://. Check your .env file."
  );
}

if (
  env.nodeEnv === "production" &&
  env.jwtSecret.includes("replace-this")
) {
  throw new Error("JWT_SECRET must be set in production");
}

module.exports = env;
