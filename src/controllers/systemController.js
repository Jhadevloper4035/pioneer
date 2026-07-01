const env = require("../config/env");
const { getLouverData } = require("../data/wpcLouvers");

function diagnostic(req, res) {
  res.render("pioneer-diagnostic", {
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
