const express = require('express');
const userController = require('./user.controller');
const { protect } = require('../../middleware/auth.middleware');
const { requirePermission, Permissions } = require('../../rbac');

const router = express.Router();

router.use(protect);

// USER routes
router.get('/me', userController.getMe);

// ADMIN routes
router.use(requirePermission(Permissions.USER_MANAGE));

router.get('/', userController.getAllUsers);
router.patch('/:id/suspend', userController.suspendUser); // Example admin action

module.exports = router;