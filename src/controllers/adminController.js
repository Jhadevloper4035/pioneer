const env = require("../config/env");
const { getSiteSetting } = require("../services/siteSettingService");
const { renderAdminPageWithLayout } = require("../services/viewRenderer");

function redirectAdmin(req, res) {
  res.redirect("/admin/dashboard");
}

function renderAdminPage(view, titleKey, options = {}) {
  return async (req, res) => {
    const adminPages = await getSiteSetting("adminPages");

    return renderAdminPageWithLayout(req, res, `admin/pages/${view}`, {
      appName: env.appName,
      pageTitle: adminPages[titleKey],
      ...options
    });
  };
}

const renderAdminLogin = renderAdminPage("login", "login", { useAdminShell: false });
const renderAdminDashboard = renderAdminPage("dashboard", "dashboard");
const renderAdminUsers = renderAdminPage("users", "users");

module.exports = {
  redirectAdmin,
  renderAdminDashboard,
  renderAdminLogin,
  renderAdminUsers
};
