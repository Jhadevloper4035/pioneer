const express = require("express");
const {
  redirectAdmin,
  renderAdminDashboard,
  renderAdminCreateJobPost,
  renderAdminEnquiries,
  renderAdminJobEnquiries,
  renderAdminJobPostDetail,
  renderAdminJobPosts,
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
router.get("/enquiries", requireAdminPage, asyncHandler(renderAdminEnquiries));
router.get("/job-enquiries", requireAdminPage, asyncHandler(renderAdminJobEnquiries));
router.get("/job-posts", requireAdminPage, asyncHandler(renderAdminJobPosts));
router.get("/job-posts/create", requireAdminPage, asyncHandler(renderAdminCreateJobPost));
router.get("/job-posts/:id", requireAdminPage, asyncHandler(renderAdminJobPostDetail));
router.get("/users", requireAdminPage, asyncHandler(renderAdminUsers));

module.exports = router;
