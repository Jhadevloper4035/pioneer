const crypto = require("crypto");
const { promisify } = require("util");

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

async function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("base64url");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `scrypt$${salt}$${derivedKey.toString("base64url")}`;
}

async function verifyPassword(password, storedHash) {
  const [algorithm, salt, hash] = String(storedHash || "").split("$");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const storedKey = Buffer.from(hash, "base64url");
  const derivedKey = await scrypt(password, salt, storedKey.length);

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedKey, derivedKey);
}

module.exports = {
  hashPassword,
  verifyPassword
};
