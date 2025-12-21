const AppError = require('../utils/AppError');

// A. Allow campaign creation only for:
// - Admin
// - Verified Club President
// - Verified Club Member
const ensureClubVerified = (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError('You must be logged in', 401));

  // Admin bypass
  if (user.role === 'ADMIN') return next();

  // Club president (must be verified)
  if (user.isClubPresident && user.clubVerified) return next();

  // Club member (must be verified)
  if (user.isClubMember && user.clubVerified) return next();

  return next(
    new AppError(
      'Only verified club members or admins can perform this action',
      403
    )
  );
};

// B. Check if user has active DreamXec Membership
const ensureMembershipActive = (req, res, next) => {
  const user = req.user;

  if (!user) return next(new AppError('You must be logged in', 401));

  // Admins bypass membership
  if (user.role === 'ADMIN') return next();

  // Checking membership flag set after Razorpay verification
  if (user.membershipActive) return next();

  return next(new AppError('Activate membership to create campaigns', 403));
};

module.exports = {
  ensureClubVerified,
  ensureMembershipActive,
};
