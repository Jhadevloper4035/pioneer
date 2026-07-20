const app = require("../src/server");
const connectDb = require("../src/config/db");
const { logger } = require("../src/config/logger");

let dbConnectionPromise;

module.exports = async function handler(req, res) {
  try {
    dbConnectionPromise = dbConnectionPromise || connectDb();
    await dbConnectionPromise;
  } catch (error) {
    dbConnectionPromise = null;
    logger.error({ err: error }, "MongoDB connection failed");
    return res.status(500).send("Database connection failed.");
  }

  return app(req, res);
};
