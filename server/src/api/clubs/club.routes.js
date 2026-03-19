const express = require('express');
const multer = require('multer');

const { protect } = require('../../middleware/auth.middleware');
const {
  uploadMembers,
  getClubMembers,
  addSingleMember,
  removeClubMember,
  getApprovedClubCampaigns,
  getPendingClubCampaigns,
  getRejectedClubCampaigns,
  changeClubPresident,
  getMyClubs,
  getAllPublicClubs,
  getPublicClubById
} = require('./club.controller');

const {
  createJoinRequest,
  getPendingJoinRequestsForPresident,
  reviewJoinRequest,
  getMyJoinRequests
} = require('./joinRequest.controller');

const router = express.Router();

// Multer: in-memory CSV upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

/* -------------------------------------------------------
   Join Requests
------------------------------------------------------- */
router.get('/my/join-requests', protect, getMyJoinRequests);
router.get('/president/join-requests', protect, getPendingJoinRequestsForPresident);
router.put('/join-requests/:requestId/review', protect, reviewJoinRequest);
router.post('/:clubId/join', protect, createJoinRequest);

/* -------------------------------------------------------
   Member Management
------------------------------------------------------- */

// Bulk upload members (CSV / JSON)
router.post(
  '/:clubId/upload-members',
  protect,
  upload.single('membersFile'),
  uploadMembers
);
// Get all clubs for the logged-in user
router.get('/my', protect, getMyClubs);

// Add single member
router.post(
  '/:clubId/add-member',
  protect,
  addSingleMember
);

// Get all members of a club
router.get(
  '/:clubId/members',
  protect,
  getClubMembers
);

// Get all public clubs
router.get('/public', getAllPublicClubs);
// Get public club by id
router.get('/public/:id', getPublicClubById);

// Remove a member
router.delete(
  '/:clubId/members/:memberId',
  protect,
  removeClubMember
);

// Change Club President
router.post(
  '/:clubId/change-president',
  protect,
  changeClubPresident
);


/* -------------------------------------------------------
   Campaign Visibility (President / Admin)
------------------------------------------------------- */

// Approved campaigns
router.get(
  '/:clubId/campaigns/approved',
  protect,
  getApprovedClubCampaigns
);

// Pending campaigns
router.get(
  '/:clubId/campaigns/pending',
  protect,
  getPendingClubCampaigns
);

// Rejected campaigns
router.get(
  '/:clubId/campaigns/rejected',
  protect,
  getRejectedClubCampaigns
);


module.exports = router;
