const path = require("path");
const express = require("express");
const env = require("./config/env");
const connectDb = require("./config/db");
const { logger, requestLogger } = require("./config/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { createRateLimiter, securityHeaders } = require("./middleware/security");
const seoMiddleware = require("./middleware/seoMiddleware");
const routes = require("./routes");

const app = express();
const publicPath = path.join(__dirname, "..", "public");
const uploadsPath = path.join(__dirname, "..", "uploads");
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests. Please try again shortly."
});
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again shortly."
});

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(requestLogger);
app.use(securityHeaders);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.static(publicPath));
app.use(env.assetRoute, express.static(publicPath));
app.use("/uploads", express.static(uploadsPath));
app.use(seoMiddleware);
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);
app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await connectDb();

  const server = app.listen(env.port, env.host, () => {
    logger.info({ host: env.host, port: env.port }, `${env.appName} running`);
  });

  server.on("error", (error) => {
    logger.fatal({ err: error, host: env.host, port: env.port }, "Failed to listen");
    process.exit(1);
  });
}


if (require.main === module) {
  startServer().catch((error) => {
    logger.fatal({ err: error }, "Failed to start server");
    process.exit(1);
  });
}

module.exports = app;
module.exports.startServer = startServer;
