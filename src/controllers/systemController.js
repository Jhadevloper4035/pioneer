const env = require("../config/env");
const { renderPublicPage } = require("../services/viewRenderer");
const { getLouverProducts } = require("../services/louverService");

async function diagnostic(req, res) {
  const products = await getLouverProducts();

  return renderPublicPage(req, res, "public/pages/pioneer-diagnostic", {
    nodeVersion: process.version,
    productsLoaded: products.length
  });
}

function health(req, res) {
  res.status(200).json({
    app: env.appName,
    environment: env.nodeEnv,
    status: "ok",
    uptime: process.uptime()
  });
}

module.exports = {
  diagnostic,
  health
};
