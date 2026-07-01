const env = require("../config/env");

function redirectAdmin(req, res) {
  res.redirect("/admin/dashboard");
}

function renderAdminPage(view, pageTitle) {
  return (req, res) => {
    res.render(`admin/${view}`, {
      appName: env.appName,
      pageTitle
    });
  };
}

const renderAdminLogin = renderAdminPage("login", "Admin Login");
const renderAdminDashboard = renderAdminPage("dashboard", "Admin Dashboard");
const renderAdminUsers = renderAdminPage("users", "Admin Users");

module.exports = {
  redirectAdmin,
  renderAdminDashboard,
  renderAdminLogin,
  renderAdminUsers
};
