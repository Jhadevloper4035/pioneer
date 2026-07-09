const path = require("path");
const express = require("express");
const env = require("./config/env");
const connectDb = require("./config/db");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { createRateLimiter, securityHeaders } = require("./middleware/security");
const seoMiddleware = require("./middleware/seoMiddleware");
const adminApiRoutes = require("./routes/adminApiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const catalogueRoutes = require("./routes/catalogueRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const homeRoutes = require("./routes/homeRoutes");
const productRoutes = require("./routes/productRoutes");
const systemRoutes = require("./routes/systemRoutes");

const app = express();
const publicPath = path.join(__dirname, "..", "public");
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

app.use(securityHeaders);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.static(publicPath));
app.use(env.assetRoute, express.static(publicPath));
app.use(seoMiddleware);
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);
app.use("/admin", adminRoutes);
app.use("/api/admin", adminApiRoutes);
app.use("/api/auth", authRoutes);
app.use(homeRoutes);
app.use(enquiryRoutes);
app.use(galleryRoutes);
app.use(blogRoutes);
app.use(catalogueRoutes);
app.use(productRoutes);
app.use(systemRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDb();
  } catch (error) {
    if (env.nodeEnv === "production") {
      throw error;
    }

    console.warn(`MongoDB unavailable. Starting ${env.appName} without database: ${error.message}`);
  }

  const server = app.listen(env.port, env.host, () => {
    console.log(`${env.appName} running at http://${env.host}:${env.port}`);
  });

  server.on("error", (error) => {
    console.error(`Failed to listen on ${env.host}:${env.port}`, error);
    process.exit(1);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
}

module.exports = app;
module.exports.startServer = startServer;
