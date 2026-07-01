const app = require("../src/server");
const connectDb = require("../src/config/db");

let dbConnectionPromise;

module.exports = async function handler(req, res) {
  try {
    dbConnectionPromise = dbConnectionPromise || connectDb();
    await dbConnectionPromise;
  } catch (error) {
    dbConnectionPromise = null;
    console.error(`MongoDB connection failed: ${error.message}`);
    return res.status(500).send("Database connection failed.");
  }

  return app(req, res);
};
