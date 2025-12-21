const Razorpay = require("razorpay");
const crypto = require("crypto");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// STEP 1: Create Razorpay Order
exports.createOrder = async (req, res, next) => {
  try {
    const { amount, projectId, name, email, message, anonymous } = req.body;
    const user = req.user || null;

    // Validate project
    const project = await prisma.userProject.findUnique({ where: { id: projectId } });
    if (!project || project.status !== "APPROVED") {
      return next(new AppError("Project not found or not open for donations", 404));
    }

    const amountInPaise = amount * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `donation_${Date.now()}`,
      notes: {
        projectId,
        donorId: user?.id || "",
        guestName: name || "",
        guestEmail: email || "",
        message: message || "",
        anonymous: anonymous ? "yes" : "no",
      },
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: amountInPaise,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return next(new AppError("Failed to create payment order", 500));
  }
};


// STEP 2: Razorpay Webhook → Verify & record donation
exports.razorpayWebhook = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expectedSignature) {
    console.log("❌ Invalid webhook signature");
    return res.status(400).json({ status: "invalid" });
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const {
      projectId,
      donorId,
      guestName,
      guestEmail,
      message,
      anonymous,
    } = payment.notes;

    const amount = payment.amount / 100;

    await prisma.$transaction(async (tx) => {
      // Create Donation
      await tx.donation.create({
        data: {
          amount,
          message,
          anonymous: anonymous === "yes",
          userProjectId: projectId,
          donorId: donorId || null,
          guestName,
          guestEmail: req.user ? null : guestEmail,
          guestPAN: req.user ? null : guestPAN,
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id,
          paymentStatus: "completed",
        },
      });

      // Increment amountRaised
      await tx.userProject.update({
        where: { id: projectId },
        data: {
          amountRaised: { increment: amount },
        },
      });
    });
  }

  return res.json({ status: "ok" });
};


// STEP 3: Logged-in donor donations
exports.getMyDonations = async (req, res) => {
  const donations = await prisma.donation.findMany({
    where: { donorId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, donations });
};


// STEP 4: Project owner or admin
exports.getProjectDonations = async (req, res, next) => {
  const projectId = req.params.projectId;

  const project = await prisma.userProject.findUnique({ where: { id: projectId } });

  if (!project) return next(new AppError("Project not found", 404));

  // Only admin or project owner
  if (req.user.role !== "ADMIN" && req.user.id !== project.userId) {
    return next(new AppError("Not authorized", 403));
  }

  const donations = await prisma.donation.findMany({
    where: { userProjectId: projectId },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, donations });
};

// DONOR: Get donation summary (impact dashboard)
exports.getDonationSummary = catchAsync(async (req, res, next) => {
  const donorId = req.user.id;

  const donations = await prisma.donation.findMany({
    where: {
      donorId,
      paymentStatus: 'completed',
    },
    select: {
      amount: true,
      userProjectId: true,
    },
  });

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const projectsSupported = new Set(donations.map(d => d.userProjectId)).size;

  res.status(200).json({
    status: 'success',
    data: {
      totalAmount,
      projectsSupported,
      donationsCount: donations.length,
    },
  });
});
