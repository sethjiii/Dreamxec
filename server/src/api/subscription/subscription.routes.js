const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth.middleware");
const subscriptionController = require("./subscription.controller");

router.post("/create", protect, subscriptionController.createSubscription);
router.post("/verify", subscriptionController.verifyWebhook);

module.exports = router;
