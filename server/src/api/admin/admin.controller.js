const prisma = require('../../config/prisma.js');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// All the admin stats required
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    userCount,
    donorCount,
    clubCount,
    campaignStats,
    donationStats,
    pendingVerifications,
    pendingDonorProjects,
    slaBreaches,
    frozenCampaigns
  ] = await prisma.$transaction([
    // 1. total users
    prisma.user.count(),

    //2. total donors
    prisma.donor.count(),

    //3. total clubs
    prisma.club.count(),

    //4. campaign stats (group by status)
    prisma.userProject.groupBy({
      by: ['status'],
      _count: { status: true }
    }),

    //5. total donation sum
    prisma.donation.aggregate({
      _sum: { amount: true }
    }),

    //6. pending approval (verfications)
    prisma.clubVerification.count({ where: { status: 'PENDING' } }),

    //7. pending approvals (donor projects)
    prisma.donorProject.count({ where: { status: 'PENDING' } }),

    //8. attention: items pending beyond sla > 7 days
    prisma.userProject.count({
      where: {
        status: 'PENDING',
        createdAt: { lt: sevenDaysAgo }
      }
    }),

    //9. Attention: frozen cammpaigns (approved but not updated in > 30days)
    prisma.userProject.count({
      where: {
        status: 'APPROVED',
        updatedAt: { lt: thirtyDaysAgo }
      }
    })
  ]);

  const campaigns = {
    APPROVED: 0,
    PENDING: 0,
    REJECTED: 0,
    total: 0
  };

  campaignStats.forEach(stat => {
    campaigns[stat.status] = stat._count.status;
    campaigns.total += stat._count.status;
  })

  const totalPendingActions =
    campaigns.PENDING +
    pendingVerifications +
    pendingDonorProjects;

  res.status(200).json({
    status: 'success',
    data: {
      kpi: {
        totalUsers: userCount,
        totalDonors: donorCount,
        totalClubs: clubCount,
        totalDonations: donationStats._sum.amount || 0,
        campaigns,
        pendingApprovals: totalPendingActions,
        openTickets: 0
      },
      attention: {
        slaBreaches,
        frozenCampaigns,
        failedMilestones: 0
      }
    }
  })
})


// ######################################
// PROJECT MANAGEMENT
// ######################################

// ADMIN: Get all projects (both user and donor projects)
exports.getAllProjects = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  const skip = (page - 1) * limit;

  // FIlter objects

  const userProjectFilter = status ? { status } : {};
  const donorProjectFilter = status ? { status } : {};

  // fetch data & counts in parallel

  const [
    userProjects,
    totalUserProjects,
    donorProjects,
    totalDonorProjects
  ] = await prisma.$transaction([
    prisma.userProject.findMany({
      where: userProjectFilter,
      include: {
        user: { select: { id: true, name: true, email: true } },
        club: { select: { name: true, college: true } },
        donations: { select: { amount: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.userProject.count({ where: userProjectFilter }),

    prisma.donorProject.findMany({
      where: donorProjectFilter,
      include: {
        donor: {
          select: { id: true, name: true, email: true, organizationName: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.donorProject.count({ where: donorProjectFilter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      userProjects: {
        data: userProjects,
        pagination: {
          total: totalUserProjects,
          page,
          limit,
          totalPages: Math.ceil(totalUserProjects / limit)
        }
      },
      donorProjects: {
        data: donorProjects,
        pagination: {
          total: totalDonorProjects,
          page,
          limit,
          totalPages: Math.ceil(totalDonorProjects / limit)
        }
      }
    }
  })
});

// ADMIN: Approve or reject a user project
exports.verifyUserProject = catchAsync(async (req, res, next) => {
  const { status, reason } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return next(new AppError('Status must be either APPROVED or REJECTED', 400));
  }

  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { email: true, name: true } } }
  });

  if (!userProject) {
    return next(new AppError('User project not found', 404));
  }

  // Update status and save rejection reason if rejected
  const updateData = { status };
  if (status === 'REJECTED' && reason) {
    updateData.rejectionReason = reason;
  } else if (status === 'APPROVED') {
    updateData.rejectionReason = null; // Clear any previous rejection reason
  }

  const updatedUserProject = await prisma.userProject.update({
    where: { id: req.params.id },
    data: updateData
  });

  // Log Audit
  await prisma.auditlog.create({
    data: {
      action: `PROJECT_${status}`,
      entityType: 'UserProject',
      entityId: userProject.id,
      performedby: req.user.id,
      details: { reason }
    }
  });

  // Send email notification to project owner
  // Send Email
  if (userProject.user?.email) {
    const messages = {
      APPROVED: 'Congratulations! Your project is now live.',
      REJECTED: `Your project was rejected. Reason: ${reason}`,
      PAUSED: 'Your project has been paused by the admin team.'
    };

    try {
      await sendEmail({
        email: userProject.user.email,
        subject: `Project Update: ${userProject.title}`,
        message: `Dear ${userProject.user.name},\n\n${messages[status]}\n\nBest,\nDreamXec Team`
      });
    } catch (err) {
      console.error('Email error:', err);
    }
  }

  res.status(200).json({
    status: 'success',
    data: { userProject: updatedUserProject }
  });
});

// ADMIN: Approve or reject a donor project
exports.verifyDonorProject = catchAsync(async (req, res, next) => {
  const { status, reason } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return next(new AppError('Status must be either APPROVED or REJECTED', 400));
  }

  const donorProject = await prisma.donorProject.findUnique({
    where: { id: req.params.id },
    include: { donor: { select: { email: true, name: true } } }
  });

  if (!donorProject) {
    return next(new AppError('Donor project not found', 404));
  }

  // Update status and save rejection reason if rejected
  const updateData = { status };
  if (status === 'REJECTED' && reason) {
    updateData.rejectionReason = reason;
  } else if (status === 'APPROVED') {
    updateData.rejectionReason = null; // Clear any previous rejection reason
  }

  const updatedDonorProject = await prisma.donorProject.update({
    where: { id: req.params.id },
    data: updateData
  });

  // log audit 
  await prisma.auditlog.create({
    data: {
      action: `DONOR_PROJECT_${status}`,
      entityType: 'DonorProject',
      entityId: donorProject.id,
      performedBy: req.user.id,
      details: { reason }
    }
  });

  // Send email notification to donor
  if (donorProject.donor?.email) {
    try {
      await sendEmail({
        email: donorProject.donor.email,
        subject: `Project Update: ${donorProject.title}`,
        message: `Your project has been ${status}. ${reason ? `Reason: ${reason}` : ''}`
      });
    } catch (err) {
      console.error('Email error:', err);
    }
  }

  res.status(200).json({
    status: 'success',
    data: { donorProject: updatedDonorProject }
  });
});

// ##################################################
// USER & DONOR MANAGEMENT
// ##################################################

// ADMIN: Get all registered users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      accountStatus: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          userProjects: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

// ADMIN: Get all registered donors
exports.getAllDonors = catchAsync(async (req, res, next) => {
  const donors = await prisma.donor.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      organizationName: true,
      accountStatus: true,
      verified: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          donations: true,
          donorProjects: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: donors.length,
    data: { donors }
  });
});


// ---------------------------------------------------
// GOVERNANCE (BLOCK / SUSPEND)
// ---------------------------------------------------

// ADMIN: Change User Status (Block/Unblock)
exports.manageUserStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['ACTIVE', 'BLOCKED', 'SUSPENDED', 'UNDER_REVIEW'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { accountStatus: status }
  });

  // Log Audit
  await prisma.auditLog.create({
    data: {
      action: `USER_STATUS_CHANGE`,
      entityType: 'User',
      entityId: user.id,
      performedBy: req.user.id,
      details: { newStatus: status }
    }
  });

  res.status(200).json({ status: 'success', data: { user } });
});

// ADMIN: Get All Clubs (Active + Suspended)
exports.getAllClubs = catchAsync(async (req, res, next) => {
  const clubs = await prisma.club.findMany({
    include: {
      presidentUser: { select: { name: true, email: true } },
      _count: {
        select: { members: true, campaigns: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: clubs.length,
    data: { clubs }
  });
});

// ADMIN: Change Club Status (Suspend/Activate)
exports.manageClubStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['ACTIVE', 'BLOCKED', 'SUSPENDED', 'UNDER_REVIEW'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }

  const club = await prisma.club.update({
    where: { id: req.params.id },
    data: { status } // accountStatus field in Club model
  });

  await prisma.auditLog.create({
    data: {
      action: `CLUB_STATUS_CHANGE`,
      entityType: 'Club',
      entityId: club.id,
      performedBy: req.user.id,
      details: { newStatus: status }
    }
  });

  res.status(200).json({ status: 'success', data: { club } });
});

// ##################################################
// CLUB VERIFICATION & Management
// ##################################################


// ADMIN: Get all club verification requests
exports.getPendingClubVerifications = catchAsync(async (req, res, next) => {
  const requests = await prisma.clubVerification.findMany({
    where: { status: 'PENDING' },
    include: {
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: requests.length,
    data: { requests }
  });
});


// ADMIN: Approve or reject club verification request
exports.verifyClub = catchAsync(async (req, res, next) => {
  const { status, reason } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return next(new AppError('Status must be APPROVED or REJECTED', 400));
  }

  const request = await prisma.clubVerification.findUnique({
    where: { id: req.params.id },
    include: {
      user: true
    }
  });

  if (!request)
    return next(new AppError('Club verification request not found', 404));

  const updated = await prisma.clubVerification.update({
    where: { id: req.params.id },
    data: {
      status,
      rejectionReason: status === 'REJECTED' ? reason : null
    }
  });

  // Update user if approved
  if (status === 'APPROVED') {
    await prisma.user.update({
      where: { id: request.userId },
      data: {
        clubVerified: true,
        clubId: request.clubId
      }
    });
  }

  // send email
  try {
    await sendEmail({
      email: request.user.email,
      subject: `Your club verification was ${status}`,
      message: status === 'APPROVED'
        ? `Congratulations! You are now verified as: ${request.position}`
        : `Your verification request was rejected.\nReason: ${reason}`
    });
  } catch (err) {
    console.error(err);
  }

  res.status(200).json({ status: 'success', data: { updated } });
});


// Append to server/src/api/admin/admin.controller.js

// 1. Manage User Status (Block/Unblock)
exports.manageUserStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  // Basic validation
  if (!['ACTIVE', 'BLOCKED', 'SUSPENDED'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { accountStatus: status } // Ensure your Prisma schema has this field!
  });

  res.status(200).json({ status: 'success', data: { user } });
});

// 2. Get All Clubs
exports.getAllClubs = catchAsync(async (req, res, next) => {
  const clubs = await prisma.club.findMany({
    include: {
      presidentUser: { select: { name: true, email: true } },
      _count: { select: { members: true, campaigns: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: clubs.length,
    data: { clubs }
  });
});

// 3. Manage Club Status
exports.manageClubStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  
  const club = await prisma.club.update({
    where: { id: req.params.id },
    data: { status } // Ensure Club model has 'status' field in Prisma
  });

  res.status(200).json({ status: 'success', data: { club } });
});

// ---------------------------------------------------
// CSV UPLOAD
// ---------------------------------------------------

/**
 * Expected CSV columns: name,email,phone,role
 * Query/body param: clubId
 */
exports.uploadClubMembers = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('CSV file is required', 400));
  const clubId = req.body.clubId;
  
  if (!clubId) {
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    return next(new AppError('clubId is required in form body', 400));
  }

  const rows = [];
  const errors = [];
  const stream = fs.createReadStream(req.file.path).pipe(csv());

  stream.on('data', (row) => {
    // normalize keys and trim whitespace
    const name = (row.name || row.Name || row.fullname || '').trim();
    const email = (row.email || row.Email || '').trim().toLowerCase();
    const phone = (row.phone || row.Phone || row.mobile || '').trim();
    const role = (row.role || row.Role || 'member').trim();

    if (!name || !email) {
      errors.push({ row, message: 'Missing name or email' });
      return;
    }

    rows.push({ name, email, phone, role });
  });

  await new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  // process rows (upsert users or create membership records)
  const created = [];
  for (const r of rows) {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email: r.email } });

      if (existingUser) {
        // create membership linking to user
        await prisma.clubMembership.create({
          data: {
            clubId,
            userId: existingUser.id,
            name: r.name,
            email: r.email,
            phone: r.phone || null,
          },
        });

        // mark user properties
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { isClubMember: true, clubIds: { push: clubId } },
        });
      } else {
        // create membership entry (no user)
        await prisma.clubMembership.create({
          data: {
            clubId,
            name: r.name,
            email: r.email,
            phone: r.phone || null,
          },
        });
      }

      created.push(r.email);
    } catch (err) {
      // Duplicate entry usually
      errors.push({ email: r.email, message: 'Already exists or error' });
    }
  }

  // remove file
  try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }

  res.status(201).json({
    status: 'success',
    imported: created.length,
    errors,
  });
});

// ADMIN: Get all members of a club
exports.getClubMembers = catchAsync(async (req, res, next) => {
  const members = await prisma.clubMembership.findMany({
    where: { clubId: req.params.clubId },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: members.length,
    data: { members }
  });
});