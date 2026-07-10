const env = require("../config/env");
const AppError = require("../utils/AppError");
const { signJwt } = require("../utils/jwt");
const { hashPassword, verifyPassword } = require("../utils/password");
const {
  normalizeEmail,
  normalizeMobileNumber
} = require("../utils/authValidators");
const {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByMobileNumber,
  updateUser
} = require("./userRepository");

const MAX_FAILED_LOGINS = 5;
const LOGIN_LOCK_MINUTES = 15;

function nowIso() {
  return new Date().toISOString();
}

function addMinutes(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    roles: user.roles || ["user"],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt || null
  };
}

function createSession(user) {
  return signJwt(
    {
      sub: user.id,
      email: user.email,
      roles: user.roles || ["user"]
    },
    {
      audience: env.jwtAudience,
      expiresIn: env.jwtExpiresIn,
      issuer: env.jwtIssuer,
      secret: env.jwtSecret
    }
  );
}

async function registerUser(payload) {
  const email = normalizeEmail(payload.email);
  const mobileNumber = normalizeMobileNumber(payload.mobileNumber);

  if (await findUserByEmail(email)) {
    throw new AppError("An account with this email already exists", 409);
  }

  if (await findUserByMobileNumber(mobileNumber)) {
    throw new AppError("An account with this mobile number already exists", 409);
  }

  try {
    const user = await createUser({
      name: String(payload.name).trim(),
      email,
      mobileNumber,
      passwordHash: await hashPassword(payload.password),
      roles: ["user"],
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: null
    });

    return {
      user: sanitizeUser(user)
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("An account with this email or mobile number already exists", 409);
    }

    throw error;
  }
}

async function loginUser(payload) {
  const email = normalizeEmail(payload.email);
  const user = await findUserByEmail(email, { includePrivate: true });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
    throw new AppError("Account is temporarily locked. Try again later.", 423);
  }

  const isPasswordValid = await verifyPassword(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    const failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    const lockedUntil =
      failedLoginAttempts >= MAX_FAILED_LOGINS ? addMinutes(LOGIN_LOCK_MINUTES) : null;

    await updateUser(user.id, {
      failedLoginAttempts,
      lockedUntil
    });

    throw new AppError("Invalid email or password", 401);
  }

  const updatedUser = await updateUser(user.id, {
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: nowIso()
  });
  const session = createSession(updatedUser);

  return {
    token: session.token,
    tokenType: "Bearer",
    expiresIn: session.expiresIn,
    user: sanitizeUser(updatedUser)
  };
}

async function getUserProfile(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Account not found", 404);
  }

  return sanitizeUser(user);
}

module.exports = {
  getUserProfile,
  loginUser,
  registerUser,
  sanitizeUser
};
