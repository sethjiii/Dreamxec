const express = require("express");
const router = express.Router();

const { cleanupRedis } = require("./adminRedis.controller");
const { protect } = require("../../middleware/auth.middleware");

// Inline admin check
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};

router.post(
  "/redis/cleanup",
  protect,      // ✅ now a function
  adminOnly,    // ✅ function
  cleanupRedis  // ✅ function
);

module.exports = router;
