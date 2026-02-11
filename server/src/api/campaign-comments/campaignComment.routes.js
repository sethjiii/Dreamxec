// campaignComment.routes.js
const express = require("express");
const router = express.Router();
const controller = require("./campaignComment.controller");
const authMiddleware = require("../../middlewares/auth"); // adjust path

router.post(
  "/campaigns/:campaignId/comments",
  authMiddleware,
  controller.create
);

router.get(
  "/campaigns/:campaignId/comments",
  controller.getAll
);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  controller.remove
);

router.post(
  "/comments/:commentId/report",
  authMiddleware,
  controller.report
);

module.exports = router;
