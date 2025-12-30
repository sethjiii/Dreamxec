const prisma = require("../../config/prisma");

exports.referClub = async (req, res) => {
  try {
    const {
      clubName,
      collegeName,
      presidentEmail,
      presidentPhone,
      presidentName,
      ficEmail,
      ficPhone,
      ficName,
      instagram,
      linkedIn,
      portfolio
    } = req.body;

    const referral = await prisma.clubReferralRequest.create({
      data: {
        clubName,
        collegeName,
        presidentEmail,
        presidentPhone,
        presidentName,
        ficEmail,
        ficPhone,
        ficName,
        instagram,
        linkedIn,
        portfolio,
        referrerEmail: req.user.email,
        status: "PENDING",
        referrerId: req.user.id,
      }
    });

    res.status(201).json({
      success: true,
      message: "Club referral submitted successfully",
      data: referral
    });

  } catch (error) {
    console.error("Referral Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.listReferrals = async (req, res) => {
  const referrals = await prisma.clubReferralRequest.findMany({ orderBy: { createdAt: 'desc' }});
  res.json({ success: true, data: referrals });
};

exports.getReferral = async (req, res) => {
  const id = req.params.id;
  const r = await prisma.clubReferralRequest.findUnique({ where: { id }});
  if (!r) return res.status(404).json({ success:false, message:'Not found' });
  res.json({ success:true, data: r });
};

exports.approveReferral = async (req, res) => {
  const id = req.params.id;
  await prisma.clubReferralRequest.update({ where:{ id }, data:{ status: 'APPROVED' }});
  // optionally create Club row or notify president
  res.json({ success:true });
};

exports.rejectReferral = async (req, res) => {
  const id = req.params.id;
  const { reason } = req.body;
  await prisma.clubReferralRequest.update({ where:{ id }, data:{ status: 'REJECTED', rejectionReason: reason }});
  res.json({ success:true });
};
