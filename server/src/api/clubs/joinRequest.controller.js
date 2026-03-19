const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendEmail } = require('../../services/email.service');

// 1. Create a Join Request
exports.createJoinRequest = async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.id;

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      include: { presidentUser: { select: { email: true, name: true } } }
    });

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Check if user is already a member
    if (club.userIds && club.userIds.includes(userId)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this club' });
    }

    // Check existing request
    const existingRequest = await prisma.joinRequest.findUnique({
      where: {
        userId_clubId: { userId, clubId }
      }
    });

    if (existingRequest) {
      if (existingRequest.status === 'PENDING') {
        return res.status(400).json({ success: false, message: 'Your request is currently pending.' });
      }
      if (existingRequest.status === 'APPROVED') {
        return res.status(400).json({ success: false, message: 'You are already approved.' });
      }
      if (existingRequest.status === 'REJECTED') {
        // Check 30-day cooldown
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        if (new Date(existingRequest.updatedAt) > thirtyDaysAgo) {
          return res.status(400).json({ 
            success: false, 
            message: 'Your previous request was rejected. You can apply again 30 days after rejection.' 
          });
        }
        
        // Update to PENDING
        const updatedReq = await prisma.joinRequest.update({
          where: { id: existingRequest.id },
          data: { status: 'PENDING' },
          include: { user: true }
        });

        // Send Email to President
        notifyPresident(club, updatedReq.user);
        return res.status(200).json({ success: true, message: 'Join request sent successfully re-submitted', data: updatedReq });
      }
    }

    // Create new request
    const newReq = await prisma.joinRequest.create({
      data: {
        userId,
        clubId,
        status: 'PENDING'
      },
      include: { user: true }
    });

    // Send Email to President
    notifyPresident(club, newReq.user);

    return res.status(201).json({ success: true, message: 'Join request sent successfully', data: newReq });
  } catch (error) {
    console.error('Error creating join request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Internal function to notify President
async function notifyPresident(club, user) {
  try {
    const president = club.presidentUser;
    if (!president || !president.email) return;

    const htmlMsg = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #003366;">New Club Join Request</h2>
        <p>Hi ${president.name || 'President'},</p>
        <p>You have a new join request for <strong>${club.name}</strong> from <strong>${user.name}</strong>.</p>
        <p>Please log in to your DreamXec President Dashboard to review this request.</p>
        <br>
        <p>Best Regards,</p>
        <p>The DreamXec Team</p>
      </div>
    `;
    await sendEmail({
      email: president.email,
      subject: `New Join Request for ${club.name}`,
      html: htmlMsg,
      message: `You have a new join request for ${club.name} from ${user.name}. Please review it on your dashboard.`
    });
  } catch (err) {
    console.error('Failed to send president notification email:', err);
  }
}

// 2. Get Pending Join Requests for President
exports.getPendingJoinRequestsForPresident = async (req, res) => {
  try {
    const userId = req.user.id;
    // Check which clubs this user is a president for
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { clubIds: true, isClubPresident: true }
    });

    if (!user.isClubPresident || !user.clubIds || user.clubIds.length === 0) {
      return res.status(403).json({ success: false, message: 'Not authorized as a club president' });
    }

    // Fetch pending requests
    const pendingRequests = await prisma.joinRequest.findMany({
      where: {
        clubId: { in: user.clubIds },
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            bio: true,
            skills: true
          }
        },
        club: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedReqs = pendingRequests.map(req => ({
      ...req,
      user: {
        ...req.user,
        college: req.user.college || 'N/A'
      }
    }));

    res.status(200).json({ success: true, data: formattedReqs });
  } catch (error) {
    console.error('Error fetching join requests for president:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 3. Review Request (Approve / Reject)
exports.reviewJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'APPROVE' or 'REJECT'
    const userId = req.user.id;

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    const joinReq = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { club: { select: { userIds: true, id: true } }, user: { select: { id: true, clubIds: true } } }
    });

    if (!joinReq) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Check if the current user is President of the specific club
    const currentUser = await prisma.user.findUnique({ where: { id: userId }});
    if (!currentUser.clubIds.includes(joinReq.clubId) || !currentUser.isClubPresident) {
      return res.status(403).json({ success: false, message: 'Unauthorized to review for this club' });
    }

    if (action === 'APPROVE') {
      // 1. Update JoinRequest
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' }
      });

      // 2. Connect user to club (m2m arrays)
      await prisma.club.update({
        where: { id: joinReq.clubId },
        data: { userIds: { push: joinReq.userId } }
      });
      await prisma.user.update({
        where: { id: joinReq.userId },
        data: { 
          clubIds: { push: joinReq.clubId },
          isClubMember: true,
          clubVerified: true
        }
      });

      // 3. Create ClubMember record so student shows in members list
      const studentUser = await prisma.user.findUnique({ where: { id: joinReq.userId } });
      await prisma.clubMember.upsert({
        where: {
          clubId_email: { clubId: joinReq.clubId, email: studentUser.email }
        },
        update: {
          userId: joinReq.userId,
          isUserRegistered: true
        },
        create: {
          clubId: joinReq.clubId,
          email: studentUser.email,
          name: studentUser.name || '',
          userId: joinReq.userId,
          isUserRegistered: true
        }
      });

      return res.status(200).json({ success: true, message: 'Request approved successfully' });
    } else if (action === 'REJECT') {
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });
      return res.status(200).json({ success: true, message: 'Request rejected successfully' });
    }

  } catch (error) {
    console.error('Error reviewing join request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 4. Get My Join Requests (For Student)
exports.getMyJoinRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.joinRequest.findMany({
      where: { userId },
      include: { club: { select: { id: true, name: true } } },
      orderBy: { updatedAt: 'desc' }
    });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching student join requests:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
