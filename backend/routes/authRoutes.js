const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', require('../controllers/authController').googleLogin);

module.exports = router;
