const mongoose = require("mongoose");
const env = require("./env");

mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production",
    serverSelectionTimeoutMS: 5000
  });

  console.log("MongoDB connected");
  return mongoose.connection;
}

module.exports = connectDb;
