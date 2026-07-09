const COOKIE_NAME = "pioneer_admin_token";

function getCookie(req, name = COOKIE_NAME) {
  const cookies = req.get("cookie") || "";
  const prefix = `${name}=`;
  const cookie = cookies
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : "";
}

function sessionCookie(token, maxAge, secure) {
  return [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
    secure ? "Secure" : ""
  ].filter(Boolean).join("; ");
}

function clearSessionCookie(secure) {
  return sessionCookie("", 0, secure);
}

module.exports = {
  clearSessionCookie,
  getCookie,
  sessionCookie
};
