const express = require("express");
const {
  redirectAdmin,
  renderAdminDashboard,
  renderAdminLogin,
  renderAdminUsers
} = require("../controllers/adminController");

const router = express.Router();

router.get("/", redirectAdmin);
router.get("/login", renderAdminLogin);
router.get("/dashboard", renderAdminDashboard);
router.get("/users", renderAdminUsers);

module.exports = router;
