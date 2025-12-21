const express = require('express');
const adminController = require('./admin.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { verifyProjectSchema } = require('./admin.validation');
const upload = require('../../middleware/upload.middleware'); // for CSV uploads

const router = express.Router();

// All admin routes require ADMIN role
router.use(protect);
router.use(restrictTo('ADMIN'));

// --------------------
// PROJECT MANAGEMENT
// --------------------

// Get all projects
router.get('/projects', adminController.getAllProjects);

// Approve/reject user projects
router.patch(
  '/projects/user/:id/verify',
  validate(verifyProjectSchema),
  adminController.verifyUserProject
);

// Approve/reject donor projects
router.patch(
  '/projects/donor/:id/verify',
  validate(verifyProjectSchema),
  adminController.verifyDonorProject
);

// --------------------
// USER & DONOR LISTS
// --------------------
router.get('/users', adminController.getAllUsers);
router.get('/donors', adminController.getAllDonors);

// --------------------
// CLUB VERIFICATION SYSTEM
// --------------------

// Get all pending club verifications
router.get('/clubs/pending', adminController.getPendingClubVerifications);

// Approve or reject a specific club verification
router.patch('/clubs/verify/:id', adminController.verifyClub);

// Upload CSV of club members
router.post(
  '/clubs/members/upload',
  upload.single('file'),
  adminController.uploadClubMembers
);

// POST /api/admin/clubs/members/upload
router.post(
  '/clubs/members/upload',
  upload.single('file'),
  adminController.uploadClubMembers
);

// Fetch all members of a club
router.get('/clubs/members/:clubId', adminController.getClubMembers);

module.exports = router;
