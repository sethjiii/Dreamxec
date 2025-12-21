const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../../middleware/auth.middleware");
const {
  listVerifications,
  getVerification,
  approveVerification,
  rejectVerification,
} = require("./adminClubVerification.controller");

router.use(protect, restrictTo("ADMIN"));

router.get("/verifications", listVerifications);
router.get("/verifications/:id", getVerification);
router.post("/verifications/:id/approve", approveVerification);
router.post("/verifications/:id/reject", rejectVerification);

module.exports = router;
