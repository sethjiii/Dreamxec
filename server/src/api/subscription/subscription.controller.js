const Razorpay = require("razorpay");
const prisma = require("../../config/prisma");

const razorpay = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET
});

// 1️⃣ Create subscription
exports.createSubscription = async (req, res) => {
  const planId = process.env.RZP_PLAN_ID; // yearly DreamXec membership

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    quantity: 1,
  });

  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      subscriptionStatus: "PENDING",
      subscriptionId: subscription.id
    }
  });

  res.json({
    status: "success",
    subscriptionId: subscription.id,
  });
};

// 2️⃣ Handle Razorpay membership webhook
exports.verifyWebhook = async (req, res) => {
  const event = req.body;

  if (event.event === "subscription.activated") {
    const subId = event.payload.subscription.entity.id;

    await prisma.user.updateMany({
      where: { subscriptionId: subId },
      data: {
        subscriptionStatus: "ACTIVE",
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });
  }

  res.json({ status: "ok" });
};
