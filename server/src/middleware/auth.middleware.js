const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const prisma = require('../config/prisma');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Extract token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // --- PRODUCTION SAFE FIX ---
  // Do NOT throw noisy AppError. Return silent 401 JSON.
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not logged in',
    });
  }

  // Verify token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }

  // Find user or donor
  let currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });

  // ---------------------------------------------------------
  // RBAC UPDATE 1: Normalize roles for both Users and Donors
  // ---------------------------------------------------------
  if (!currentUser) {
    currentUser = await prisma.donor.findUnique({ where: { id: decoded.id } });
    if (currentUser) {
      // Assign the new roles array based on donor tier
      const donorRole = currentUser.subscriptionStatus === 'PREMIUM' ? 'PREMIUM_DONOR' : 'DONOR';
      currentUser.roles = [donorRole]; 
    }
  } else {
    // Safely ensure standard Users have the array even if migration missed them
    currentUser.roles = currentUser.roles?.length 
      ? currentUser.roles 
      : currentUser.role 
        ? [currentUser.role] 
        : ["USER"];
  }

  // Token valid but user deleted (use AppError — real error)
  if (!currentUser) {
    return next(
      new AppError('The account belonging to this token no longer exists.', 401)
    );
  }

  // Attach user to request
  req.user = currentUser;
  next();
});
