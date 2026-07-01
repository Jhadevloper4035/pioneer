const crypto = require("crypto");
const AppError = require("./AppError");

function base64UrlEncode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function base64UrlDecode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function sign(input, secret) {
  return crypto.createHmac("sha256", secret).update(input).digest("base64url");
}

function parseDuration(value) {
  if (typeof value === "number") return value;

  const match = String(value || "").trim().match(/^(\d+)([smhd])?$/);
  if (!match) return 3600;

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2] || "s";
  const multipliers = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60
  };

  return amount * multipliers[unit];
}

function signJwt(payload, options) {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = parseDuration(options.expiresIn);
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const body = {
    ...payload,
    iss: options.issuer,
    aud: options.audience,
    iat: now,
    exp: now + expiresIn
  };
  const encodedHeader = base64UrlEncode(header);
  const encodedBody = base64UrlEncode(body);
  const signature = sign(`${encodedHeader}.${encodedBody}`, options.secret);

  return {
    token: `${encodedHeader}.${encodedBody}.${signature}`,
    expiresIn
  };
}

function verifyJwt(token, options) {
  const [encodedHeader, encodedBody, signature] = String(token || "").split(".");

  if (!encodedHeader || !encodedBody || !signature) {
    throw new AppError("Invalid authorization token", 401);
  }

  const expectedSignature = sign(`${encodedHeader}.${encodedBody}`, options.secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== actualBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    throw new AppError("Invalid authorization token", 401);
  }

  const payload = base64UrlDecode(encodedBody);
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp <= now) {
    throw new AppError("Authorization token expired", 401);
  }

  if (options.issuer && payload.iss !== options.issuer) {
    throw new AppError("Invalid authorization token issuer", 401);
  }

  if (options.audience && payload.aud !== options.audience) {
    throw new AppError("Invalid authorization token audience", 401);
  }

  return payload;
}

module.exports = {
  parseDuration,
  signJwt,
  verifyJwt
};
