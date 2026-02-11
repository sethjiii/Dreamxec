const express = require('express');
const adminController = require('./admin.controller');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

// --- DASHBOARD STATS ---
router.get('/stats', adminController.getDashboardStats); // Make sure controller has this!

// --- PROJECTS ---
router.get('/projects', adminController.getAllProjects);
router.patch('/projects/user/:id/verify', adminController.verifyUserProject);
router.patch('/projects/donor/:id/verify', adminController.verifyDonorProject);

// --- USERS & GOVERNANCE ---
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.manageUserStatus); // <--- NEW

router.get('/donors', adminController.getAllDonors);

// --- CLUBS ---
router.get('/clubs', adminController.getAllClubs); // <--- NEW
router.patch('/clubs/:id/status', adminController.manageClubStatus); // <--- NEW
router.get('/clubs/members/:clubId', adminController.getClubMembers);
router.post('/clubs/members/upload', upload.single('file'), adminController.uploadClubMembers);

// --- VERIFICATIONS ---
router.get('/club-verifications/verifications', adminController.getPendingClubVerifications);
router.post('/club-verifications/verifications/:id/approve', adminController.verifyClub);
router.post('/club-verifications/verifications/:id/reject', adminController.verifyClub);

module.exports = router;