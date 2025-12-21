const express = require("express");
const { protect } = require("../../middleware/auth.middleware");
const { referClub } = require("./clubReferral.controller");
const validate = require("../../middleware/validate.middleware");
const { clubReferralSchema } = require("./clubReferral.validation");

const router = express.Router();

router.post(
  "/refer",
  protect,
  validate(clubReferralSchema),
  referClub
);

module.exports = router;
