const env = require("../config/env");
const { renderAdminPageWithLayout } = require("../services/viewRenderer");

function redirectAdmin(req, res) {
  res.redirect("/admin/dashboard");
}

function renderAdminPage(view, pageTitle, options = {}) {
  return async (req, res) => {
    return renderAdminPageWithLayout(req, res, `admin/pages/${view}`, {
      appName: env.appName,
      pageTitle,
      ...options
    });
  };
}

const renderAdminLogin = renderAdminPage("login", "Admin Login", { useAdminShell: false });
const renderAdminDashboard = renderAdminPage("dashboard", "Admin Dashboard");
const renderAdminUsers = renderAdminPage("users", "Admin Users");

module.exports = {
  redirectAdmin,
  renderAdminDashboard,
  renderAdminLogin,
  renderAdminUsers
};
