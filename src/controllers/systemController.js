const env = require("../config/env");
const { getLouverData } = require("../data/wpcLouvers");
const { renderPublicPage } = require("../services/viewRenderer");

function diagnostic(req, res) {
  return renderPublicPage(req, res, "public/pages/pioneer-diagnostic", {
    nodeVersion: process.version,
    productsLoaded: getLouverData().products.length
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
