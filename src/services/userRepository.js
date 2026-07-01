const User = require("../models/User");
const mongoose = require("mongoose");

const privateFields = "+passwordHash +failedLoginAttempts +lockedUntil";

function normalizeUser(user) {
  if (!user) return null;

  const object =
    typeof user.toObject === "function"
      ? user.toObject({ getters: true, virtuals: true })
      : user;

  return {
    ...object,
    id: String(object._id || object.id)
  };
}

async function findUserByEmail(email, options = {}) {
  const query = User.findOne({ email });

  if (options.includePrivate) {
    query.select(privateFields);
  }

  return normalizeUser(await query);
}

async function findUserByMobileNumber(mobileNumber, options = {}) {
  const query = User.findOne({ mobileNumber });

  if (options.includePrivate) {
    query.select(privateFields);
  }

  return normalizeUser(await query);
}

async function findUserById(id, options = {}) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const query = User.findById(id);

  if (options.includePrivate) {
    query.select(privateFields);
  }

  return normalizeUser(await query);
}

async function listUsers() {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(normalizeUser);
}

async function createUser(user) {
  const createdUser = await User.create(user);
  return normalizeUser(createdUser);
}

async function updateUser(userId, updates) {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: updates
    },
    {
      returnDocument: "after"
    }
  ).select(privateFields);

  return normalizeUser(updatedUser);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByMobileNumber,
  listUsers,
  updateUser
};
