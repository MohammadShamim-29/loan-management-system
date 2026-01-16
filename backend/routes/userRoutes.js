const express = require('express');
const { getProfile, updateProfile, getAllUsers } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/', auth, getAllUsers);

module.exports = router;
