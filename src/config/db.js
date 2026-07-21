const mongoose = require("mongoose");
const dns = require("dns");
const env = require("./env");
const { logger } = require("./logger");

dns.setDefaultResultOrder("ipv4first");
mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production",
    family: 4,
    serverSelectionTimeoutMS: 10000
  });

  logger.info("MongoDB connected");
  return mongoose.connection;
}

module.exports = connectDb;
