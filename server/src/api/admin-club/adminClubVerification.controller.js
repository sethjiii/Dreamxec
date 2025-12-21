const prisma = require("../../config/prisma");

exports.listVerifications = async (req, res) => {
  const { status, skip = 0, take = 50 } = req.query;
  const where = {};
  if (status) where.status = status;
  const list = await prisma.clubVerification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: Number(skip),
    take: Number(take),
  });
  res.json({ success: true, data: list });
};

exports.getVerification = async (req, res) => {
  const { id } = req.params;
  const item = await prisma.clubVerification.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: item });
};

exports.approveVerification = async (req, res) => {
  const { id } = req.params;
  // update verification status and possibly mark user's clubVerified true
  const updated = await prisma.clubVerification.update({
    where: { id },
    data: {
      status: "APPROVED",
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    },
  });

  // OPTIONAL: mark the user (president) as clubVerified:
  if (updated.userId) {
    await prisma.user.update({
      where: { id: updated.userId },
      data: { clubVerified: true, isClubPresident: true },
    });
  }

  res.json({ success: true, data: updated });
};

exports.rejectVerification = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const updated = await prisma.clubVerification.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason: reason || null,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    },
  });
  res.json({ success: true, data: updated });
};
