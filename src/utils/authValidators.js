function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeMobileNumber(mobileNumber) {
  return String(mobileNumber || "").replace(/[\s().-]/g, "");
}

function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 10 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function isE164MobileNumber(mobileNumber) {
  return /^\+[1-9]\d{7,14}$/.test(normalizeMobileNumber(mobileNumber));
}

module.exports = {
  isE164MobileNumber,
  isStrongPassword,
  normalizeEmail,
  normalizeMobileNumber
};
