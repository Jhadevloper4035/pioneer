const express = require("express");
const {
  redirectAdmin,
  renderAdminDashboard,
  renderAdminLogin,
  renderAdminUsers
} = require("../controllers/adminController");
const authenticate = require("../middleware/authenticate");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

function requireAdminPage(req, res, next) {
  return authenticate(req, res, (error) => {
    if (error || !req.user?.roles?.includes("admin")) {
      return res.redirect("/admin/login");
    }

    return next();
  });
}

router.get("/", redirectAdmin);
router.get("/login", asyncHandler(renderAdminLogin));
router.get("/dashboard", requireAdminPage, asyncHandler(renderAdminDashboard));
router.get("/users", requireAdminPage, asyncHandler(renderAdminUsers));

module.exports = router;
