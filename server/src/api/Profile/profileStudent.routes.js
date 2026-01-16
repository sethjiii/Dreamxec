const express = require('express');
const router = express.Router();

// Zaroori: Yahan { updateProfile } bracket lagana zaroori hai
const { updateProfile } = require('./profileStudent.controller');
// Middleware (agar hai toh)
// const { isAuthenticated } = require('../../middleware/auth');


router.post('/', updateProfile);

module.exports = router;