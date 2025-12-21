const express = require('express');
const multer = require('multer');

const { protect, restrictTo } = require('../../middleware/auth.middleware');
const {
  uploadMembers,
  getClubMembers,
  addSingleMember,
} = require('./club.controller');

const router = express.Router();

// use memory storage (we parse CSV in-memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file limit
});

// Upload file (CSV) or send JSON array in body
// Only president (STUDENT_PRESIDENT) or ADMIN can upload member lists
router.post('/:clubId/upload-members', protect, restrictTo('STUDENT_PRESIDENT', 'ADMIN'), upload.single('membersFile'), uploadMembers);

// Add single member via JSON (body) - president/admin only
router.post('/:clubId/add-member', protect, restrictTo('STUDENT_PRESIDENT', 'ADMIN'), addSingleMember);

// Get members (admin/president) or public? keep protected here
router.get('/:clubId/members', protect, restrictTo('STUDENT_PRESIDENT', 'ADMIN'), getClubMembers);

module.exports = router;
