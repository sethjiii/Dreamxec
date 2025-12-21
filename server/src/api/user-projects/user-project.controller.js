const prisma = require('../../config/prisma');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const sendEmail = require('../../services/email.service');

// -------------------------
// CREATE USER PROJECT
// -------------------------
// USER: Create a user project (Only verified club members)
exports.createUserProject = catchAsync(async (req, res, next) => {
  // 1️⃣ User must belong to a club
  if (!req.user.clubId) {
    return next(new AppError(
      'You must be part of a verified college club/society to create a campaign.',
      403
    ));
  }

  // 2️⃣ Club must be approved by admin
  if (!req.user.clubVerified) {
    return next(new AppError(
      'Your club has not been verified yet. Please wait for admin approval.',
      403
    ));
  }

  // 3️⃣ User must be in verified members list
  if (!req.user.isClubMember) {
    return next(new AppError(
      'You are not in the approved club member list. Ask your club president to upload or verify your details.',
      403
    ));
  }

  // 4️⃣ (Future) Check DreamXec subscription
  if (req.user.subscriptionStatus !== 'ACTIVE') {
    return next(new AppError(
      'Please activate your DreamXec membership to create campaigns.',
      403
    ));
  }

  // 5️⃣ Normal project creation
  const { title, description, companyName, skillsRequired, timeline, goalAmount, imageUrl } = req.body;

  const userProject = await prisma.userProject.create({
    data: {
      title,
      description,
      companyName: companyName || null,
      skillsRequired: skillsRequired || [],
      timeline: timeline || null,
      goalAmount,
      imageUrl: imageUrl || null,
      userId: req.user.id,
    },
  });

  res.status(201).json({ status: 'success', data: { userProject } });
});


// -------------------------
// UPDATE USER PROJECT
// -------------------------
exports.updateUserProject = catchAsync(async (req, res, next) => {
  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
  });

  if (!userProject) return next(new AppError('User project not found', 404));

  if (userProject.userId !== req.user.id) {
    return next(new AppError('You are not authorized to edit this project', 403));
  }

  if (userProject.status !== 'PENDING' && userProject.status !== 'REJECTED') {
    return next(
      new AppError('Only PENDING or REJECTED projects can be updated.', 400)
    );
  }

  const updatedUserProject = await prisma.userProject.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.status(200).json({
    status: 'success',
    data: { userProject: updatedUserProject },
  });
});

// -------------------------
// DELETE USER PROJECT
// -------------------------
exports.deleteUserProject = catchAsync(async (req, res, next) => {
  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
  });

  if (!userProject) return next(new AppError('User project not found', 404));

  if (userProject.userId !== req.user.id) {
    return next(new AppError('You are not authorized to delete this project', 403));
  }

  if (userProject.status !== 'PENDING' && userProject.status !== 'REJECTED') {
    return next(
      new AppError('Only PENDING or REJECTED projects can be deleted.', 400)
    );
  }

  await prisma.userProject.delete({ where: { id: req.params.id } });

  res.status(204).json({ status: 'success', data: null });
});

// -------------------------
// GET USER PROJECT BY ID
// -------------------------
exports.getUserProject = catchAsync(async (req, res, next) => {
  const userProject = await prisma.userProject.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { id: true, name: true } },
      donations: {
        select: {
          amount: true,
          createdAt: true,
          donor: { select: { name: true } },
          anonymous: true,
        },
      },
    },
  });

  if (!userProject) {
    return next(new AppError('User project not found', 404));
  }

  res.status(200).json({ status: 'success', data: { userProject } });
});

// -------------------------
// GET PUBLIC PROJECTS
// -------------------------
exports.getPublicUserProjects = catchAsync(async (req, res, next) => {
  const userProjects = await prisma.userProject.findMany({
    where: { status: 'APPROVED' },
    include: {
      user: { select: { id: true, name: true } },
      donations: { select: { amount: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    status: 'success',
    results: userProjects.length,
    data: { userProjects },
  });
});

// -------------------------
// GET MY PROJECTS
// -------------------------
exports.getMyUserProjects = catchAsync(async (req, res, next) => {
  const userProjects = await prisma.userProject.findMany({
    where: { userId: req.user.id },
    include: {
      user: { select: { name: true, id: true } },
      donations: { select: { amount: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    status: 'success',
    results: userProjects.length,
    data: { userProjects },
  });
});
